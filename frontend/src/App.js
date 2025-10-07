import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import FormatterPage from './pages/FormatterPage';
import QAPage from './pages/QAPage';
import CorrectionPage from './pages/CorrectionPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';

function About() { return <AboutPage />; }
function Login() { return <LoginPage />; }
function Register() { return <RegisterPage />; }
function Logout() { return <h1>Logout</h1>; }
function Home() { return <HomePage />; }

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#1976d2" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/formatter" element={<FormatterPage />} />
          <Route path="/qa" element={<QAPage />} />
          <Route path="/correction" element={<CorrectionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
