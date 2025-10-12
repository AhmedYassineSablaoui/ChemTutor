## 📝 Backend README (ChemTutor/backend/README.md)


# 🔄 ChemTutor Backend

This is the **Django REST API** powering ChemTutor.  
It handles:
- Reaction balancing
- Compound lookup
- Health checks
- Communication with AI models (T-5 small, Transformers)
- Chemistry question correction
- chemistry  Q&A 

---

## ⚙️ Tech Stack

- Django 4.2.7
- Django REST Framework 3.14.0
- PostgreSQL + Redis
- RDKit (molecule parsing, reactions)
- PubChemPy (compound metadata)
- Transformers + Torch (T5-small model)
- LlamaIndex + LangChain

---

## 📂 Folder Structure

backend/
├── api/ # API apps (reactions, health)
├── chemtutor/ # Project settings
├── manage.py
├── requirements.txt
├── Dockerfile
└── tests/





## 📦 Dependencies

Main packages (`requirements.txt`):
django==4.2.7
djangorestframework==3.14.0
psycopg2-binary==2.9.9
redis==5.0.1
django-cors-headers==4.3.1
rdkit==2023.9.6
pubchempy==1.0.4
transformers==4.41.2
torch==2.3.0
pytest==8.3.2
pytest-django==4.9.0


## 🔌 API Endpoints

| Endpoint                  | Method | Description |
|---------------------------|--------|-------------|
| `/api/health/`            | GET    | Check API status |
| `/api/reactions/balance/` | POST   | Balance a chemical reaction |
| `/admin/`                 | GET    | Django admin panel |
| `/qa/`                    | POST   | Q&A                |
| `/correction/`             | POST   | Correct chemistry questions|        
| `/auth/profile/`           | GET    | get Profile infos |
| `/auth/logout/`            | GET    | log out the authentification
| `/auth/login/`             | POST   | Log in        |
| `/auth/register/`          | POST   | Register


## 🚀 Run Locally (Docker)


docker-compose up --build
The backend will be available at:

http://localhost:8000

## 📌 Notes
RDKit must be installed via Conda or prebuilt Docker image (already configured in Dockerfile).

For heavy ML features, CPU-only Torch is used by default.
