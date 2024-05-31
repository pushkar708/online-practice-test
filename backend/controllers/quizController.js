const db = require('../config/db.json');
const fs = require('fs');
const path = require('path');

// Define route handler for starting the quiz
exports.startQuiz = (req, res) => {
  const questions = db.questions;
  res.status(200).json(questions);
};

exports.submitQuiz = (req, res) => {
  const { userId, answers } = req.body;
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const correctAnswers = answers.filter(ans => {
    const question = db.questions.find(q => q.id === ans.questionId);
    return question && question.correctAnswer === ans.answer;
  }).length;

  const result = {
    userId,
    correctAnswers,
    totalQuestions: answers.length,
    date: new Date().toISOString()
  };

  user.quizzes.push(result);
  fs.writeFileSync(path.join(__dirname, '../config/db.json'), JSON.stringify(db, null, 2));
  res.status(200).json(result);
};

// Admin CRUD operations
exports.getQuestions = (req, res) => {
  res.status(200).json(db.questions);
};

exports.createQuestion = (req, res) => {
  const newQuestion = req.body;
  newQuestion.id = db.questions.length ? db.questions[db.questions.length - 1].id + 1 : 1;
  db.questions.push(newQuestion);
  fs.writeFileSync(path.join(__dirname, '../config/db.json'), JSON.stringify(db, null, 2));
  res.status(201).json(newQuestion);
};

exports.updateQuestion = (req, res) => {
  const { id } = req.params;
  const updatedQuestion = req.body;
  const questionIndex = db.questions.findIndex(q => q.id === parseInt(id));

  if (questionIndex !== -1) {
    db.questions[questionIndex] = { ...db.questions[questionIndex], ...updatedQuestion };
    fs.writeFileSync(path.join(__dirname, '../config/db.json'), JSON.stringify(db, null, 2));
    res.status(200).json(db.questions[questionIndex]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};

exports.deleteQuestion = (req, res) => {
  const { id } = req.params;
  const questionIndex = db.questions.findIndex(q => q.id === parseInt(id));

  if (questionIndex !== -1) {
    const deletedQuestion = db.questions.splice(questionIndex, 1);
    fs.writeFileSync(path.join(__dirname, '../config/db.json'), JSON.stringify(db, null, 2));
    res.status(200).json(deletedQuestion);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
};
