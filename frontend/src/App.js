import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { healthCheck } from './api';
import Navbar from './components/Navbar';
import FeatureSelector from './components/FeatureSelector';
import FormatterPage from './pages/FormatterPage';
import QAPage from './pages/QAPage';
import CorrectionPage from './pages/CorrectionPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function About() { return <h1>About ChemTutor</h1>; }
function Login() { return <LoginPage />; }
function Register() { return <RegisterPage />; }
function Logout() { return <h1>Logout</h1>; }

function Home() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    healthCheck()
      .then(data => {
        setStatus(data.status);
        setError('');
      })
      .catch(() => {
        setError('Failed to connect to API');
        setStatus('');
      });
  }, []);

  return (
    <div>
      <h1>Home - API Status: {status || 'Loading...'}</h1>
      {error && <p className="text-danger">{error}</p>}
      <FeatureSelector />
    </div>
  );
}

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
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
