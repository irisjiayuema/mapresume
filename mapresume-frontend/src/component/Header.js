import React from "react";
import "../assets/style/Header.css";
import logo from "../assets/logo.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse,faFile,faChartSimple,faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="Header">
        <nav className="navbar">
            <img alt="logo" src={logo} className='logo'/>
            <ul className="nav-links">
                <li><a href="/" className="nav-link"><FontAwesomeIcon icon={faHouse}/><span>Home</span></a></li>
                <li><a href="/Charts" className="nav-link"><FontAwesomeIcon icon={faChartSimple} /><span>Charts</span></a></li>
                <li><a href="/Match" className="nav-link"><FontAwesomeIcon icon={faFile} /><span>Match</span></a></li>
                <li><a href="/About" className="nav-link"><FontAwesomeIcon icon={faCircleInfo} /><span>About</span></a></li>
            </ul>
        </nav>
    </header>
  );
}

export default Header;

