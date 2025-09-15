import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { healthCheck } from './api';
import Navbar from './components/Navbar';
import FeatureSelector from './components/FeatureSelector';
import FormatterPage from './pages/FormatterPage';

function About() { return <h1>About ChemTutor</h1>; }
function Login() { return <h1>Login</h1>; }
function Register() { return <h1>Register</h1>; }
function Correction() { return <h1>Correction</h1>; }
function QandA() { return <h1>Q&A</h1>; }
function ReactionFormatter() { return <h1>Reaction Formatter</h1>; }
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
      .catch(err => {
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
  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/formatter' element={<FormatterPage />} />
          <Route path='/qa' element={<QandA />} />
          <Route path='/correction' element={<Correction />} />
          <Route path='/logout' element={<Logout />} />
        </Routes>
        <button className="btn btn-primary">Test Bootstrap</button>
      </div>
    </div>
  );
}

export default App;
