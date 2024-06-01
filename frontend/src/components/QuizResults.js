import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const QuizResults = () => {
    const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user && token) {
      fetchQuizResults();
    }
  }, [user, token]);

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  const fetchQuizResults = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${user.email}/quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Quiz Results</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Total Questions Attempted</th>
            <th>Correct Answers</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={index}>
              <td>{quiz.tag}</td>
              <td>{quiz.totalQuestions}</td>
              <td>{quiz.correctAnswers}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <a href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </a>
          <button onClick={handleSignout} className="btn btn-danger">
              Sign out
            </button>
    </div>
  );
};

export default QuizResults;
