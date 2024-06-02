import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";  
import ExcelJS from 'exceljs/dist/exceljs.min.js';

const QuizResults = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const areasToFocus = [];

  quizzes.forEach(quiz => {
    const percentageCorrect = (quiz.correctAnswers / quiz.totalQuestions) * 100;
    if (percentageCorrect < 50) {
      areasToFocus.push(toTitleCase(quiz.tag));
    }
  });

  useEffect(() => {
    if (user && token) {
      fetchQuizResults();
    }
  }, [user, token]);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quiz Results');
  
    // Add headers
    worksheet.addRow(['Tag', 'Total Questions Attempted', 'Correct Answers', 'Percentage Correct']);
  
    // Add data rows
    quizzes.forEach(quiz => {
      const percentageCorrect = (quiz.correctAnswers / quiz.totalQuestions) * 100;
      worksheet.addRow([toTitleCase(quiz.tag), quiz.totalQuestions, quiz.correctAnswers, percentageCorrect.toFixed(2)]);
    });
  
    // Calculate total questions attempted and total correct answers
    const totalQuestionsAttempted = quizzes.reduce((total, quiz) => total + quiz.totalQuestions, 0);
    const totalCorrectAnswers = quizzes.reduce((total, quiz) => total + quiz.correctAnswers, 0);
  
    worksheet.addRow(['Total Questions Attempted', totalQuestionsAttempted]);
    worksheet.addRow(['Total Correct Answers', totalCorrectAnswers]);
  
    // Determine areas to focus on
    quizzes.forEach(quiz => {
      const percentageCorrect = (quiz.correctAnswers / quiz.totalQuestions) * 100;
      if (percentageCorrect < 50) {
        areasToFocus.push(toTitleCase(quiz.tag));
      }
    });
  
    if (areasToFocus.length > 0) {
      worksheet.addRow(['Areas to Focus On:', areasToFocus.join(', ')]);
    } else {
      worksheet.addRow(['Congratulations! No areas to focus on.']);
    }
  
    // Generate Excel file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quiz_results.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  


  const fetchQuizResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/${user.email}/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };
  function toTitleCase(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Calculate total questions attempted and total correct questions
  let totalQuestionsAttempted = 0;
  let totalCorrectAnswers = 0;

  quizzes.forEach((quiz) => {
    totalQuestionsAttempted += quiz.totalQuestions;
    totalCorrectAnswers += quiz.correctAnswers;
  });

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
              <td>{toTitleCase(quiz.tag)}</td>
              <td>{quiz.totalQuestions}</td>
              <td>{quiz.correctAnswers}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-row">
        <table className="table">
          <tbody>
            <tr>
              <td className="bold-text">
                Total Questions Attempted: {totalQuestionsAttempted}
              </td>
              <td className="bold-text">
                Total Correct Answers: {totalCorrectAnswers}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
  <h2>Areas to Focus On</h2>
  {areasToFocus.length > 0 ? (
    <p className="areas-to-focus">{areasToFocus.join(", ")}</p>
  ) : (
    <p>No specific areas to focus on. Keep up the good work!</p>
  )}
  <p>Resources: </p>
  <ul className=" d-flex decoration-none justify-content">
  <li className="list-margin list-decor"><a href="https://www.khanacademy.org/" className="text-decoration-none">Khan Academy</a></li>
  <li className="list-margin list-decor"><a href="https://byjus.com/" className="text-decoration-none">Byju's</a></li>
  <li className="list-margin list-decor"><a href="https://www.coursera.org/" className="text-decoration-none">Coursera</a></li>
  <li className="list-margin list-decor"><a href="https://wiingy.com/tutoring/subject/math-tutors/" className="text-decoration-none">Wiingy</a></li>
  <li className="list-margin list-decor"><a href="https://www.mathplayground.com/" className="text-decoration-none">Math Playground</a></li>
  </ul>
</div>
      <div className="d-flex gap-2">
        <a href="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </a>
      <button onClick={exportToExcel} className="btn btn-primary">Export to Excel</button>
      </div>
        <button onClick={handleSignout} className="btn btn-danger">
          Sign out
        </button>
    </div>
  );
};

export default QuizResults;
