# backend/build_vectorstore.py
from backend.utils.vectorstore import create_vectorstore

if __name__ == "__main__":
    try:
        print("Building vectorstore using local embeddings...")
        create_vectorstore()
        print("Vectorstore built successfully with local embeddings!")
    except Exception as e:
        print("Failed to build vectorstore:", e)
