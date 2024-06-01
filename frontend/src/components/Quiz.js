import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Quiz = () => {
  const navigate = useNavigate();
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

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCheckboxChange = (questionId, option) => {
    setAnswers({
      ...answers,
      [questionId]: option
    });
  };

  const getUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        return userId;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      const userId = getUserId();
      const formattedAnswers = Object.keys(answers).map(questionId => {
        const question = questions.find(q => q._id === questionId);
        return {
          questionId: questionId,
          answer: answers[questionId],
          tags: question ? question.tags.join(', ') : ''
        };
      });

      const response = await axios.post('http://localhost:5000/api/quiz/submit', { userId, answers: formattedAnswers });
      setResult(response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  let totalCorrectAnswers = 0;
  Object.keys(answers).forEach(questionId => {
    const question = questions.find(q => q._id === questionId);
    if (question && answers[questionId] === question.correctAnswer) {
      totalCorrectAnswers++;
    }
  });

  if (result) {
    const totalQuestionsAttempted = Object.keys(answers).length;
    return (
      <div className="container my-5">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quiz Result</h2>
          </div>
          <div className="card-body">
            <p>Score: {totalCorrectAnswers} / {totalQuestionsAttempted}</p>
          </div>
          <a href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </a>
          <button onClick={handleSignout} className="btn btn-danger">
            Sign out
          </button>
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
                      name={`question-${currentQuestion._id}`}
                      checked={answers[currentQuestion._id] === option}
                      onChange={() => handleCheckboxChange(currentQuestion._id, option)}
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
