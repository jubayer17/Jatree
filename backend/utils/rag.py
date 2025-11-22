import os
import time
import re
from google.genai import Client, types
from backend.utils.vectorstore import load_vectorstore

# =====================================================
#  GEMINI CLIENT SETUP
# =====================================================
GEMINI_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
genai_client = Client(api_key=GEMINI_KEY) if GEMINI_KEY else None
HAS_GEMINI = genai_client is not None


# =====================================================
#  LOAD VECTORSTORE
# =====================================================
try:
    _vectorstore = load_vectorstore()
except FileNotFoundError:
    _vectorstore = None


# =====================================================
#  MARKDOWN / SYMBOL CLEANER
# =====================================================
def clean_output(text: str) -> str:
    """Remove markdown symbols (*, -, _, #, **) and normalize spacing."""
    if not text:
        return text

    # remove markdown formatting
    text = re.sub(r'[*_`#>-]', '', text)

    # remove accidental double spaces
    text = re.sub(r'\s+', ' ', text)

    return text.strip()


# =====================================================
#  SAFE GEMINI CALL
# =====================================================
def _safe_gemini(prompt: str,
                 max_output_tokens: int = 500,
                 temperature: float = 0.35) -> str:
    """A safer wrapper around Gemini with full fallback."""

    if not HAS_GEMINI:
        return "AI model is not configured on the server."

    try:
        response = genai_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                max_output_tokens=max_output_tokens,
                temperature=temperature
            )
        )

        if not response or not response.text:
            return None  # triggers retry

        return clean_output(response.text)

    except Exception as e:
        print("[Gemini Error]", e)
        return None  # triggers retry


# =====================================================
#  GENERATE ANSWER (RAG + GENERIC CHAT)
# =====================================================
def generate_answer(question: str,
                    top_k: int = 4,
                    similarity_threshold: float = 0.32) -> str:
    """
    Enhanced RAG:
    - Extremely stable
    - Very natural responses
    - Never outputs markdown symbols
    - Strong fallback conversation mode
    """

    if _vectorstore is None:
        return "Vectorstore is not ready. Please rebuild it first."

    # Search dataset
    hits = _vectorstore.similarity_search(question, k=top_k)
    relevant = [h for h in hits if h["score"] >= similarity_threshold]

    # =====================================================
    #  CASE 1 — RAG MODE (context available)
    # =====================================================
    if relevant:
        context = "\n".join(f"- {h['text']}" for h in relevant)

        prompt = (
            "You are an intelligent bus travel assistant. "
            "Use ONLY the given context to answer. "
            "If something is unclear, ask the user politely. "
            "Do NOT use markdown symbols like *, -, _, #. "
            "Respond naturally like a human.\n\n"
            f"Context:\n{context}\n\n"
            f"User Question: {question}\n\n"
            "Give a clear and friendly answer:"
        )

    # =====================================================
    #  CASE 2 — GENERIC CHAT MODE (no context match)
    # =====================================================
    else:
        prompt = (
            "You are a friendly conversational AI. "
            "The user asked something outside the dataset. "
            "Give a natural, clean and helpful reply. "
            "Avoid markdown symbols like *, -, _, #. "
            "If the question is unclear, ask a small follow-up.\n\n"
            f"User: {question}\n"
            "Reply:"
        )

    # =====================================================
    #  GEMINI CALL WITH RETRIES
    # =====================================================
    last_err = None

    for attempt in range(4):
        answer = _safe_gemini(prompt, max_output_tokens=500, temperature=0.45)

        if answer:  # success
            return answer

        last_err = f"Attempt {attempt + 1} returned empty."
        wait = 2 ** (attempt + 1)

        print(f"[RAG] Retry in {wait}s — {last_err}")
        time.sleep(wait)

    # =====================================================
    #  FINAL FAILURE FALLBACK
    # =====================================================
    return "I'm having some trouble answering right now. Please try again shortly."
