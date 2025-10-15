# 🧪 ChemTutor

ChemTutor is an **AI-powered chemistry assistant** that can:
- 🧬 Answer chemistry questions with step-by-step reasoning
- ⚗️ Balance and explain chemical reactions
- 📚 Review and correct chemistry content submitted by users

It combines modern AI models with chemistry-specific tools like **RDKit** and **PubChemPy** to provide accurate, structured, and educational answers.

---

## 🚀 Features

- **Q&A** – Ask chemistry questions and get detailed explanations  
- **Reaction Formatter** – Balance chemical equations automatically  
- **Content Review** – Submit text and get corrections + explanations  
- **Compound Lookup** – Metadata, molecular weight, and synonyms  
- **AI-Powered** – Uses T-5 small + Transformers + optional LangChain/LlamaIndex  

---

## 🛠️ Tech Stack

| Layer        | Tech Used |
|--------------|-----------|
| 🌐 Frontend  | React.js + Bootstrap + MUI |
| 🔄 Backend   | Django REST Framework |
| 🧠 AI Core   | T-5 small, Transformers, Torch |
| 🧪 Tools     | RDKit, PubChemPy |
| 🔍 Retrieval | LlamaIndex , local chemistry PDFs |
| 🐳 Runtime   | Docker + WSL2 |
| 📊 Database  | PostgreSQL, Redis |

---

## 📂 Project Structure

ChemTutor/
├── backend/ # Django REST API
├── frontend/ # React.js frontend
├── ML-NLP/ # Machine Learning Notebooks
├── .env # Environment variables
├── docker-compose.yml
├── package.json
├── pytest.ini
└── README.md


---

## 🧠 Machine Learning Notebooks

The `ML-NLP/` folder contains experiments and fine-tuning scripts used to power the AI features of ChemTutor:

1. **Correction_Chem.ipynb** — fine-tuning the `t5-small` model for chemistry statement correction.
2. **Ingestion.ipynb** — document ingestion and Q&A using LlamaIndex and a chemistry PDF.
3. **ChemTutor.ipynb** — fine-tuning `t5-small` for chemistry-related question-answer tasks.



---


## ⚡ Quick Start (Docker)

1. Clone the repo:
   ```
   git clone https://github.com/AhmedYassineSablaoui/ChemTutor.git
   cd ChemTutor
2. Create an .env file in the root directory with your configs (DB, Redis, API keys if needed).
3. docker-compose up --build
4. Access:

 Frontend: http://localhost:3000

Backend API: http://localhost:8000/api

## ✅ Testing

Run backend tests:

docker-compose exec backend pytest

## 📌 Roadmap

 Improve balancing for complex reactions

 Add reaction mechanism explanations

 Integrate literature retrieval with LlamaIndex

 ## 📜 License
 MIT License – Free to use and modify.


