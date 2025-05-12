ChemTutor
A chemistry-powered chatbot for education and assistance.
Project Structure

backend/: Django backend for API and reaction formatting.
frontend/: React frontend with Tailwind CSS.
database/: PostgreSQL configuration and initialization.
model/: Machine learning training, fine-tuning, and model storage.

Prerequisites

Ubuntu (Linux)
Docker and Docker Compose
Git
Node.js 18 (for frontend development outside Docker)
Python 3.9 (for backend/model development outside Docker)

Setup Instructions
1. Install Dependencies
sudo apt update
sudo apt install docker.io docker-compose git
sudo systemctl start docker
sudo systemctl enable docker

2. Clone the Repository
git clone https://github.com/AhmedYassineSablaoui/ChemTutor.git
cd ChemTutor

3. Build and Run
docker-compose up --build

4. Access Services

Backend: http://localhost:8000
Frontend: http://localhost:3000
Database: Managed by Docker (port 5432 internally)

Git and GitHub Setup
Initialize Local Repository (if starting fresh)
git init
git add .
git commit -m "Initial commit: Project structure and Docker setup"

Create GitHub Repository

Go to GitHub and create a new repository named ChemTutor (do not initialize with a README or .gitignore).
Link your local repository:git remote add origin https://github.com/AhmedYassineSablaoui/ChemTutor.git
git branch -M main
git push -u origin main



Contributing

Create a new branch for your feature:git checkout -b feature/<feature-name>


Commit changes:git add .
git commit -m "Add <feature-name>"


Push to GitHub:git push origin feature/<feature-name>


Open a Pull Request on GitHub.

Development

Backend: Add Django apps in backend/chem_formatter/.
Frontend: Update React components in frontend/src/.
Database: Modify database/init.sql for schema changes.
Model: Add training scripts in model/scripts/.

Dependencies

Python 3.9 (backend, model)
Node.js 18 (frontend)
PostgreSQL 13 (database)

License
MIT License (or specify your preferred license).
