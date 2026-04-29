import { useState, useRef } from "react";
import "./LoggedInPage.css";
import Popup from "./Popup";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";

GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

function LoggedInPage({ onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [newSessionFile, setNewSessionFile] = useState(null);
  const [popupSession, setPopupSession] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [difficulty, setDifficulty] = useState("Medium");
  const [language, setLanguage] = useState("hebrew");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setNewSessionFile(file);
    } else {
      alert("Please upload a PDF file only");
    }
  };

  const readPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
  };

  const generateQuestions = async (file) => {
    try {
      const pdfText = await readPDF(file);

      const res = await fetch("http://localhost:5174/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaryText: pdfText, difficulty: difficulty, language: language }),
      });

      const data = await res.json();

      let questionsArray = [];
      if (Array.isArray(data.questions)) {
        questionsArray = data.questions;
      } else if (data.questions.parts && data.questions.parts[0].text) {
        questionsArray = JSON.parse(
          data.questions.parts[0].text.replace(/```json|```/g, "").trim()
        );
      }

      console.log("Questions from backend:", questionsArray);
      return questionsArray;
    } catch (err) {
      console.error(err);
      alert("Error generating questions");
      return [];
    }
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter((session) => session.id !== id));
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newSessionName || !newSessionFile) {
      alert("Please provide a session name and a PDF file");
      return;
    }

    setLoading(true); 
    const questions = await generateQuestions(newSessionFile);

    const newSession = {
      id: Date.now(),
      name: `${newSessionName} `,
      difficulty: difficulty,
      language: language,
      file: newSessionFile,
      questions: Array.isArray(questions) ? questions : [],
    };

    setSessions([...sessions, newSession]);
    setNewSessionName("");
    setNewSessionFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    setLoading(false); 
  };

  return (
    <div className="logged-in-page">
      <div className="top-bar">
        <div className="logo-section">
          <span className="logo-text">TRIVISUM</span>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout <span>🚪</span>
        </button>
      </div>

      <div className="content">
        <h1 className="page-title">My Learning Sessions</h1>

        <div className="add-session-container">
          <h3>Add New Session</h3>
          <form onSubmit={handleAddSession} className="add-session-form">
            <div className="input-group">
              <label>Session Name</label>
              <div className="input-with-icon">
                <span className="input-icon">📑</span>
                <input
                  type="text"
                  placeholder="Enter session name"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Upload PDF Material</label>
              <div className="upload-wrapper">
                <label className="upload-label">
                  ☁️ {newSessionFile ? newSessionFile.name : "Upload PDF Material"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    hidden
                  />
                </label>
                <div className="pdf-badge">
                   <span style={{color: "white"}}>PDF</span>
                </div>
              </div>
            </div>

            {/* Difficulty Level */}
            <div className="input-group">
              <label>Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="difficulty-select"
              >
                <option value="Easy">Easy 😊</option>
                <option value="Medium">Medium 😐</option>
                <option value="Hard">Hard 🤯</option>
              </select>
              </div>
              {/* Language */}
              <div className="language-select">
                <label>Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-dropdown"
                >
                  <option value="hebrew">Hebrew</option>
                  <option value="english">English</option>
                </select>
            </div>

            <button type="submit" className="add-submit-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "+ Add Session"}
            </button>
          </form>
        </div>

        <div className="current-sessions-section">
          <h3>Current Sessions</h3>
          <div className="sessions-list">
            {sessions.map((session) => (
            
              <div key={session.id} className="session-card">
                
                <div className="session-info">
                  <h4>{session.name}</h4>
                  <p className="session-meta">
                    {session.difficulty}
                    {session.difficulty === "Easy" && " 😊"}
                    {session.difficulty === "Medium" && " 😐"}
                    {session.difficulty === "Hard" && " 🤯"} 
                    <span className="divider">|</span>
                    {session.language === "hebrew" ? "Hebrew" : "English"}
                  </p>
                </div>
                <div className= "session-controls">  
                <div className="session-file-indicator">
                  <a
                    href={URL.createObjectURL(session.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-document-icon"
                  >
                    📄 <span>PDF</span>
                  </a>
                </div>

                <div className="session-actions">
                  <button className="start-btn" onClick={() => setPopupSession(session)}>
                    Start Learning
                  </button>
                  <button className="delete-btn" onClick={() => deleteSession(session.id)}>
                    🗑 Delete
                  </button>
                </div>
                </div>

              </div>
            ))}
            
            {/* Show empty state if no sessions */}
            {sessions.length === 0 && (
              <p style={{ color: "#a0a0a8", marginTop: "20px" }}>No sessions yet. Add one above!</p>
            )}
          </div>
        </div>

        <Popup session={popupSession} onClose={() => setPopupSession(null)} />
      </div>
    </div>
  );
}

export default LoggedInPage;




