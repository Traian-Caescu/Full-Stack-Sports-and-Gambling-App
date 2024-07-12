import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const [isCasinoDropdownVisible, setCasinoDropdownVisible] = useState(false);

  return (
    <nav className="navigation-bar">
      <h1 className="project-name"><Link to="/AdminPage">Vortex Gambit</Link></h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/StandingsPage">Premier League Football</Link></li>
        <li><Link to="/AboutUsPage">About Us</Link></li>
        <li><Link to="/UnderstandingAddictionPage">Understanding Addiction</Link></li>
        <li><Link to="/ChatPage">Chat</Link></li>
        
        <li className="dropdown" onMouseEnter={() => setCasinoDropdownVisible(true)} onMouseLeave={() => setCasinoDropdownVisible(false)}>
          <button>Casino</button>
          {isCasinoDropdownVisible && (
            <div className="dropdown-content">
              <Link to="/SlotMachine">Slots</Link>
              <Link to="/Roulette">Roulette</Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
