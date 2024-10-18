import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateNewFeedbackMutation } from "../../lib/feedbackApi";
import { useGenerateApiTokenMutation } from "../../lib/userApis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faKey,
  faMessage,
  faChartBar,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import "../../Styles/Dashboard.css";

const Dashboard = () => {
  const [scores, setScores] = useState([{ question: "", score: 0 }]);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.userState);
  const [generateApiToken] = useGenerateApiTokenMutation();
  const [
    createNewFeedback,
    { data, error, isSuccess, isError, isLoading, status },
  ] = useCreateNewFeedbackMutation();

  const questions = [
    "How satisfied are you with our service?",
    "How likely are you to recommend us?",
    "How would you rate the ease of use of our product?",
  ];

  const handleScoreChange = (questionIndex, score) => {
    if (scores[0].question === "") {
      return setScores([{ question: questions[questionIndex], score }]);
    }

    setScores((prevScores) => [
      ...prevScores,
      { question: questions[questionIndex], score },
    ]);
  };

  const handleGenerateResponse = async () => {
    if (scores.length < 3) return;
    await createNewFeedback({ questions: scores, apiKey: user?.apiToken });
  };

  const navigateToResults = () => {
    navigate("/result");
  };

  const openDocumentation = () => {
    window.open(
      "https://documenter.getpostman.com/view/36998674/2sAXxV5pbd",
      "_blank"
    );
  };

  useEffect(() => {
    if (isSuccess) {
      setScores([{ question: "", score: 0 }]);
    }
  }, [isSuccess]);

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
          <li className="nav-item">
            <a onClick={navigateToResults} className="nav-link">
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              See Results
            </a>
          </li>
          <li className="nav-item">
            <a onClick={openDocumentation} className="nav-link">
              <FontAwesomeIcon icon={faBook} className="me-2" />
              API Reference
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
                        scores[index]?.score === score ? "active" : ""
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="btn btn-primary"
              onClick={handleGenerateResponse}
            >
              {!isLoading ? "Submit Feedback" : "Please wait..."}
            </button>

            <div className="response-area">
              {status === "fulfilled" && <h3>Response:</h3>}
              {status === "rejected" && <h3>Response:</h3>}
              {isSuccess && (
                <p>{data.message || "Feedback received successfully"}</p>
              )}
              {isError && error?.data?.error && <p>{error.data.error}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
