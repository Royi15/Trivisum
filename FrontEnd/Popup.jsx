import { useState, useEffect } from "react";
import "./Popup.css";

const Demo_questions = [
  {
    question: "**THIS IS A DEMO QUESTION - NO RESPONSE FROM API** What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
];

export default function Popup({ session, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (session && Array.isArray(session.questions) && session.questions.length > 0) {
      setQuestions(session.questions);
    } 
    else if (session && (!session.questions || session.questions.length === 0)) {
       setQuestions(Demo_questions);
    }
    else {
      setQuestions([]);
    }
    
    setCurrentIndex(0);
    setSelectedOption(null);
  }, [session]);

  
  if (!session) return null;

  if (questions.length === 0 && !session.name?.includes("Error")) return null;

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option) => {
    setSelectedOption(option); 
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null); 
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedOption(null); 
    }
  };

  const getOptionClass = (option) => {
    if (!currentQuestion) return "popup-option"; 
    if (option === currentQuestion.answer) return selectedOption === option ? "popup-option correct" : "popup-option correct-neutral";
    if (option === selectedOption && option !== currentQuestion.answer)
      return "popup-option incorrect";
    return "popup-option";
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">
            {session.name ? session.name : "** DEMO MODE **"}
        </h2>
        {questions.length > 0 && currentQuestion ? (
          <div className="popup-question-container">
            <strong className="popup-question">{currentQuestion.question}</strong>
            <ul className="popup-options">
              {currentQuestion.options.map((opt, i) => (
                <li
                  key={i}
                  className={getOptionClass(opt)}
                  onClick={() => handleOptionClick(opt)}
                >
                  {opt}
                  {opt === currentQuestion.answer && selectedOption === opt && (
                    <span className="checkmark">✔</span>
                  )}
                  {opt === selectedOption && opt !== currentQuestion.answer && (
                    <span className="crossmark">❌</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="popup-navigation">
              <button onClick={handlePrev} disabled={currentIndex === 0}>
                Previous
              </button>
              <span>
                {currentIndex + 1} / {questions.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="popup-no-questions">No questions available.</p>
        )}

        <button onClick={onClose} className="popup-close-btn">
          Close
        </button>
      </div>
    </div>
  );
}





