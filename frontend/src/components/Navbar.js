import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Switch } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const Navbar = ({ darkMode, setDarkMode }) => {
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

        {/* Right side: login/register + dark mode toggle */}
        <div className="d-flex align-items-center gap-3">
          <Link className="btn btn-outline-primary btn-sm" to="/login">🔑 Login</Link>
          <Link className="btn btn-primary btn-sm" to="/register">📝 Register</Link>

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
