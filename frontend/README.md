## 📝 Frontend README (ChemTutor/frontend/README.md)

# 🌐 ChemTutor Frontend

This is the **React.js frontend** for ChemTutor.  
It provides the user interface for:
- Reaction formatting
- Q&A chatbot
- Content correction

---

## ⚙️ Tech Stack

- React.js (CRA)
- Bootstrap + Material UI
- React Router
- Axios (API calls)
- React Toastify (notifications)

---

## 📂 Folder Structure

frontend/
├── public/
├── src/
│ ├── api/ # API utilities
│ ├── components/ # Navbar, FeatureSelector, etc.
│ ├── pages/ # FormatterPage, QandA, Correction
│ ├── App.js # Main routing + theme
│ ├── index.js
└── package.json

## 🚀 Run Locally
1. Install dependencies:
   ```
   npm install
2. Start development server:

npm start
3. Visit:
http://localhost:3000

## 🧩Main Components

FeatureSelector – Choose between features (Q&A, Formatter, Correction)

ReactionInput – Input for chemical equations

Navbar – Navigation + dark mode toggle

## Pages

/ → Home (API health check + feature selector)

/formatter → Reaction Formatter

/qa → Q&A

/correction → Content Review

/about, /login, /register, /logout → Placeholder pages