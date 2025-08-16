import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">ChemTutor</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/formatter">Reaction Formatter</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/qa">Q&A</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/correction">Correction</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
