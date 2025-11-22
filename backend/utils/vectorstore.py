from pathlib import Path
import os
import json
import numpy as np
from typing import List, Optional
from backend.utils.loader import prepare_chunks 


try:
    from sentence_transformers import SentenceTransformer
    HAS_LOCAL = True
except Exception:
    SentenceTransformer = None
    HAS_LOCAL = False

_LOCAL_MODEL: Optional[SentenceTransformer] = None
DEFAULT_LOCAL_MODEL = "all-MiniLM-L6-v2"
DEFAULT_DIM = 384  

BASE_DIR = Path(__file__).parent.parent
VECTOR_DIR = BASE_DIR / "vectorstore" / "simple"
VECTOR_DIR.mkdir(parents=True, exist_ok=True)
EMBED_FILE = VECTOR_DIR / "embeddings.npy"
META_FILE = VECTOR_DIR / "metas.json"


def _load_local_model() -> SentenceTransformer:
    global _LOCAL_MODEL
    if _LOCAL_MODEL is None:
        _LOCAL_MODEL = SentenceTransformer(DEFAULT_LOCAL_MODEL)
    return _LOCAL_MODEL

def embed_texts_local_safe(texts: List[str]) -> np.ndarray:
    model = _load_local_model()
    embs = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    embs = np.asarray(embs, dtype=np.float32)
 
    if embs.shape[1] != DEFAULT_DIM:
        padded = np.zeros((embs.shape[0], DEFAULT_DIM), dtype=np.float32)
        min_dim = min(embs.shape[1], DEFAULT_DIM)
        padded[:, :min_dim] = embs[:, :min_dim]
        embs = padded
    return embs


def create_vectorstore():
    """Create vectorstore from chunks and save embeddings + metas."""
    if EMBED_FILE.exists():
        EMBED_FILE.unlink()
    if META_FILE.exists():
        META_FILE.unlink()

    chunks = prepare_chunks()
    if not chunks:
        raise ValueError("No chunks found")

    print(f"[vectorstore] embedding {len(chunks)} chunks")
    embs = embed_texts_local_safe(chunks)
    np.save(EMBED_FILE, embs)

    metas = [{"text": t} for t in chunks]
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(metas, f, ensure_ascii=False)

    print(f"[vectorstore] saved {len(chunks)} embeddings -> {EMBED_FILE}")

def load_vectorstore():
    """Load persisted vectorstore and provide similarity search."""
    if not EMBED_FILE.exists() or not META_FILE.exists():
        raise FileNotFoundError("Vector store missing; run create_vectorstore() first.")

    embs = np.load(EMBED_FILE)
    with open(META_FILE, "r", encoding="utf-8") as f:
        metas = json.load(f)

    class SimpleVectorStore:
        def __init__(self, embs: np.ndarray, metas: List[dict]):
            self.embs = embs
            self.metas = metas
            norms = np.linalg.norm(self.embs, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            self.normed = self.embs / norms
            self.dim = int(self.embs.shape[1]) if self.embs.ndim == 2 else 0

        def _embed_query(self, query: str) -> np.ndarray:
            q_emb = embed_texts_local_safe([query])[0]
            q_emb = np.asarray(q_emb, dtype=np.float32)
            
            if q_emb.shape[0] != self.dim:
                if q_emb.shape[0] > self.dim:
                    q_emb = q_emb[:self.dim]
                else:
                    pad = np.zeros((self.dim - q_emb.shape[0],), dtype=np.float32)
                    q_emb = np.concatenate([q_emb, pad], axis=0)
            return q_emb

        def similarity_search(self, query: str, k: int = 4) -> List[dict]:
            q_emb = self._embed_query(query)
            q_norm = q_emb / (np.linalg.norm(q_emb) + 1e-12)
            sims = (self.normed @ q_norm).astype(np.float32)
            idx = np.argsort(-sims)[:k]
            return [{"score": float(sims[i]), "text": self.metas[i]["text"]} for i in idx]

    return SimpleVectorStore(embs, metas)

def create_dummy_vectorstore(n: int = 12, dim: int = 64) -> np.ndarray:
    """Create a dummy vectorstore for testing without embeddings."""
    chunks = [f"dummy doc {i}: sample info" for i in range(n)]
    embs = np.random.uniform(-1.0, 1.0, size=(n, dim)).astype(np.float32)
    np.save(EMBED_FILE, embs)
    metas = [{"text": t} for t in chunks]
    with open(META_FILE, "w", encoding="utf-8") as f:
        json.dump(metas, f, ensure_ascii=False)
    print(f"Created dummy vectorstore with {n} docs at {VECTOR_DIR}")
    return embs
