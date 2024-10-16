import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGenerateApiTokenMutation } from "../../lib/userApis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faKey,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import "../../Styles/Dashboard.css";

const Dashboard = () => {
  const [scores, setScores] = useState([0, 0, 0]);
  const [response, setResponse] = useState("");

  const { user } = useSelector((state) => state.userState);
  const [generateApiToken] = useGenerateApiTokenMutation();

  const questions = [
    "How satisfied are you with our service?",
    "How likely are you to recommend us?",
    "How would you rate the ease of use of our product?",
  ];

  const handleScoreChange = (questionIndex, score) => {
    const newScores = [...scores];
    newScores[questionIndex] = score;
    setScores(newScores);
  };

  const generateResponse = () => {
    setResponse(
      `Based on your feedback (scores: ${scores.join(
        ", "
      )}), we appreciate your input and will use it to improve our services.`
    );
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <h2>Dashboard</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link active">
              <FontAwesomeIcon icon={faDashboard} className="me-2" />
              Overview
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <FontAwesomeIcon icon={faKey} className="me-2" />
              API Keys
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <FontAwesomeIcon icon={faMessage} className="me-2" />
              Test API
            </a>
          </li>
        </ul>
      </nav>

      <main className="main-content">
        <h1 className="dashboard-title">Welcome to Your Dashboard</h1>

        <div className="card">
          <div className="card-header">Your API</div>
          <div className="card-body">
            {!user?.apiToken ? (
              <>
                <p>Generate an API key to get started.</p>
                <button className="btn btn-primary" onClick={generateApiToken}>
                  Generate New API Key
                </button>
              </>
            ) : (
              <div>
                <p>Your API Key:</p>
                <div className="api-key">{user.apiToken}</div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">Test API</div>
          <div className="card-body">
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p>{question}</p>
                <div className="score-buttons">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreChange(index, score)}
                      className={`score-button ${
                        scores[index] === score ? "active" : ""
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button className="btn btn-primary" onClick={generateResponse}>
              Generate Response
            </button>

            {response && (
              <div className="response-area">
                <h3>Response:</h3>
                <p>{response}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
