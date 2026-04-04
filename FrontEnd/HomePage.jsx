import React, { useState } from 'react';
import './HomePage.css';
import HeroImage from "./assets/hero-illustration.png"; 
import Popup from './Popup';

function HomePage({ onLogin }) {
  const [showDemo, setShowDemo] = useState(false);


  return (
    <div className="home-page-container">
      {/* top bar */}
      <nav className="navbar">
        <div className="logo-container">
          <span className="logo-text">Trivisum</span>
        </div>
        
        <ul className="nav-links">
          <li>FEATURES</li>
          <li>PLAY LIVE</li>
          <li>CATEGORIES</li>
          <li>ABOUT</li>
        </ul>

        <div className="auth-buttons">
          <button className="login-btn" onClick={onLogin}>Login</button>
          <button className="signup-btn">SIGN UP FREE</button>
        </div>
      </nav>

      {/* main section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            TURN YOUR PDF SUMMARIES INTO QUIZZES, INSTANTLY!
          </h1>
          <p className="hero-subtitle">
            UPLOAD YOUR COURSE PDF, AND GET MULTIPLE-CHOICE QUESTIONS TAILORED TO YOUR MATERIAL. PERFECT FOR STUDENTS.
          </p>
          <div className="hero-action-buttons">
            <button className="upload-btn">UPLOAD PDF</button>
            <button className="example-btn" onClick={() => setShowDemo(true)} >VIEW EXAMPLE QUIZ</button>
          </div>
        </div>
        
        <div className="hero-image-container">
          <img src={HeroImage} alt="PDF to Quiz Illustration" className="hero-image" /> 
        </div>
      </main>

      {/* features section */}
      <section className="features-section">
        <h2>Features at a Glance</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>AI PDF ANALYSIS</h3>
            <p>Instantly break down your study notes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>INSTANT QUESTION GENERATION</h3>
            <p>Tailored multiple-choice questions made just for you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>TRACK STUDY PROGRESS</h3>
            <p>Monitor your understanding with key concepts.</p>
          </div>
        </div>
      </section>

      {showDemo && (
        <Popup 
          session={{}} 
          onClose={() => setShowDemo(false)} 
        />
      )}
    </div>
  );
}

export default HomePage;