import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function Home() { return <h1>Home</h1>; }
function About() { return <h1>About ChemTutor</h1>; }
function Login() { return <h1>Login</h1>; }
function Register() { return <h1>Register</h1>; }
function Dashboard() { return <h1>Dashboard</h1>; }
function Profile() { return <h1>Profile</h1>; }
function Settings() { return <h1>Settings</h1>; }
function Logout() { return <h1>Logout</h1>; }

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
      <button className="btn btn-primary">Test Bootstrap</button>
    </div>
  );
}

export default App;
