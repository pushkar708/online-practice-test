import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios.get('/api/quiz/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Show result
      alert(`Quiz completed! Your score is ${score}/${questions.length}`);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Quiz</h2>
      <p>{currentQuestion.question}</p>
      {currentQuestion.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option === currentQuestion.answer)}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default Quiz;
