import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quiz/start');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCheckboxChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const handleSubmit = async () => {
    try {
      const userId = 1; // Replace with actual user ID
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        answer: answers[questionId]
      }));
      const response = await axios.post('http://localhost:5000/api/quiz/submit', { userId, answers: formattedAnswers });
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (result) {
    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quiz Result</h2>
          </div>
          <div className="card-body">
            <p>Score: {result.correctAnswers} / {result.totalQuestions}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {questions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Question {currentQuestionIndex + 1}</h2>
          </div>
          <div className="card-body">
            <p>{currentQuestion.question}</p>
            <p><strong>Tags:</strong> {currentQuestion.tags.join(', ')}</p>
            <p><strong>Difficulty:</strong> {currentQuestion.difficulty}</p>
            <ul className="list-group">
              {currentQuestion.options.map((option, index) => (
                <li key={index} className="list-group-item">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleCheckboxChange(currentQuestion.id, option)}
                    />
                    <label className="form-check-label">{option}</label>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
                >
                  Next
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;