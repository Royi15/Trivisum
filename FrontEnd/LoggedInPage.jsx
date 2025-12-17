import { useState } from "react";
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
        body: JSON.stringify({ summaryText: pdfText }),
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
      name: newSessionName,
      file: newSessionFile,
      questions: Array.isArray(questions) ? questions : [],
    };

    setSessions([...sessions, newSession]);
    setNewSessionName("");
    setNewSessionFile(null);
    setLoading(false); 
  };

  return (
    <div className="logged-in-page">
      <div className="top-bar">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="content">
        <h2>My Learning Sessions</h2>

        <form onSubmit={handleAddSession} className="add-session-form">
          <input
            type="text"
            placeholder="Session name"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Add Session"}
          </button>
        </form>

        <div className="sessions-list">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="session-card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              <span>{session.name}</span>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href={URL.createObjectURL(session.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
                >
                  📄
                </a>
                <button onClick={() => setPopupSession(session)}>Start Learning</button>
              </div>
            </div>
          ))}
        </div>

        <Popup session={popupSession} onClose={() => setPopupSession(null)} />
      </div>
    </div>
  );
}

export default LoggedInPage;




