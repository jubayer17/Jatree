# 🚌 Jatree

Jatree is a **full-stack bus ticketing & chatbot app!** 🚍🤖  
**Frontend:** Next.js | **Backend:** FastAPI | **Database:** MongoDB | **Chatbot:** RAG + LLM

---

✨ **Features**

- 👤 User signup/login with JWT authentication
- 🚌 Search, book, view & cancel bus tickets
- 🤖 Smart chatbot with dataset-first answers & LLM fallback
- 📱 Responsive UI with real-time updates
- 🐳 Dockerized backend & MongoDB for easy setup

---

🛠 **Tech Stack**

- Frontend: Next.js, React, TailwindCSS
- Backend: Python 3.11+, FastAPI, Uvicorn, Motor (async MongoDB)
- Database: MongoDB (Atlas or Docker)
- Chatbot / RAG: LangChain, Chroma/FAISS, OpenAI / Google GenAI
- Utilities: python-dotenv, passlib[bcrypt], python-multipart, python-jose

---

📋 **Prerequisites**

- Node.js >= 18 & npm/yarn ⚡
- Python 3.11+ 🐍
- Docker & Docker Compose (optional) 🐳
- OpenAI API key or Google GenAI key 🔑

---

⚡ **Installation & Setup**

## 🖥 Backend

```bash
# Go to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Create .env file with your secrets**
- MONGO_URL="your_mongodb_connection_string" 🌐
- SECRET_KEY="your_jwt_secret_key" 🔑
- OPENAI_API_KEY="your_openai_or_google_genai_key" 🤖

**Start backend server**
python -m uvicorn backend.main:app --reload

## 🌐 Frontend

```bash
# Go to frontend folder
cd frontend

# Install dependencies
npm install
```
## 🐳 Docker Instalation and Setup

**Start MongoDB container**
```
docker run -d -p 27017:27017 --name jatree_mongo mongo:6
```

**Check container status**
```
docker ps
```

**Build backend Docker image**
```
cd backend
docker build -t jatree-backend .

# Run backend container
docker run -d -p 8000:8000 --name jatree_backend \
  -e MONGO_URL="mongodb://root:password@localhost:27017/shohoj_ticket" \
  -e SECRET_KEY="your_jwt_secret_key" \
  -e OPENAI_API_KEY="your_openai_or_google_genai_key" \
  jatree-backend

# Build frontend Docker image
cd ../frontend
docker build -t jatree-frontend .

# Run frontend container
docker run -d -p 3000:3000 --name jatree_frontend \
  -e NEXT_PUBLIC_API_URL="http://localhost:8000" \
  jatree-frontend
```

## 📄 License

**MIT License** — free to use & modify ✨

## 📬 Contact

For issues or questions, contact **Jubayer Ahmed** 💌




