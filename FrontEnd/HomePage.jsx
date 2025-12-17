
import TrivisumLogo from "./assets/trivisum.png";
import './HomePage.css';

function HomePage({ onLogin }) {
  return (
    <div className="home-page">
      <div className="top-bar">
        <h1 className="site-name">Trivisum</h1>
        <button className="login-btn" onClick={onLogin}>
          Login
        </button>
      </div>

      <div className="logo-container">
        <img src={TrivisumLogo} alt="Trivisum Logo" className="trivisum-logo" />
      </div>
      <div className="bottom-bar">
        <li className="footer-item">About</li>
        <li className="footer-item">Contact Us</li>
      </div>
    </div>

  );
}

export default HomePage;
