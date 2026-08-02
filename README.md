# Smart Agriculture & Crop Advisory Platform

An AI-powered web application providing real-time crop advisory, pest and disease management guidance, fertilizer recommendations, and multi-language support (English, Hindi, Marathi, etc.) for farmers.

---

## 📁 Project Structure

```text
.
├── backend/            # FastAPI Python backend server
│   ├── app/            # Main application package (routes, models, database, etc.)
│   ├── requirements.txt# Python dependencies
│   └── .env.example    # Backend environment variables template
├── frontend/           # React + Vite frontend application
│   ├── src/            # React UI components, pages, and assets
│   ├── package.json    # Frontend Node.js dependencies & scripts
│   └── .env.example    # Frontend environment variables template
├── docs/               # Project documentation and guides
└── README.md           # Project guide and instructions
```

---

## ⚙️ Environment Setup

### 1. Backend (`backend/.env`)
Copy the `backend/.env.example` file to create `.env`:

```bash
cp backend/.env.example backend/.env
```

Fill in the required values inside `backend/.env`:
- `MONGODB_URL`: Your MongoDB Atlas connection string (or local MongoDB string)
- `DATABASE_NAME`: Name of your MongoDB database
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_ALGORITHM`: `HS256`
- `GROQ_API_KEY`: API key for Groq LLM service
- `PORT`: `8000`

### 2. Frontend (`frontend/.env`)
Copy the `frontend/.env.example` file to create `.env`:

```bash
cp frontend/.env.example frontend/.env
```

Configure backend API URL:
- `VITE_API_URL`: `https://project-yi5t.onrender.com`

---

## 🚀 Getting Started

### 📦 Backend Setup (FastAPI)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - **On Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **On macOS/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   cd app
   uvicorn main:app --reload
   ```
   The backend API will run on `http://127.0.0.1:8000`.

---

### 💻 Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The frontend app will run on `http://localhost:5173`.

---

## 🛡️ License

This project is licensed under the MIT License.
