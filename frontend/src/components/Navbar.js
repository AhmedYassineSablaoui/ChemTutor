import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Switch } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { clearAuth } from "../api";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('auth_user') || 'null') : null;

  const onLogout = () => {
    clearAuth();
    navigate('/');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid d-flex justify-content-between">
        {/* Brand logo + emoji */}
        <Link className="navbar-brand fw-bold" to="/" style={{ fontSize: "1.3rem" }}>
          🧪 ChemTutor
        </Link>

        {/* Center nav links */}
        <div className="collapse navbar-collapse d-flex justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">🏠 Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">ℹ️ About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/formatter">⚗️ Reaction Formatter</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/qa">❓ Q&A</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/correction">✍️ Correction</Link>
            </li>
          </ul>
        </div>

        {/* Right side: auth + dark mode toggle */}
        <div className="d-flex align-items-center gap-3">
          {!token ? (
            <>
              <Link className="btn btn-outline-primary btn-sm" to="/login">🔑 Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">📝 Register</Link>
            </>
          ) : (
            <>
              <span className="me-2">Hi, {user?.username || 'user'}</span>
              <Link className="btn btn-outline-primary btn-sm" to="/profile">👤 Profile</Link>
              <button className="btn btn-outline-danger btn-sm" onClick={onLogout}>🚪 Logout</button>
            </>
          )}

          {/* Dark mode toggle */}
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
