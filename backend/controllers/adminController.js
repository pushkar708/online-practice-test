const express = require('express');
const router = express.Router();
const db = require('../config/db.json');
const fs = require('fs');
const { isAdmin } = require('../middleware/authMiddleware');

// Read all questions
router.get('/questions', isAdmin, (req, res) => {
  res.status(200).json(db.questions);
});

// Create a new question
router.post('/questions', isAdmin, (req, res) => {
  const newQuestion = req.body;
  newQuestion.id = db.questions.length + 1;
  db.questions.push(newQuestion);
  fs.writeFileSync('./config/db.json', JSON.stringify(db));
  res.status(201).json(newQuestion);
});

// Update a question
router.put('/questions/:id', isAdmin, (req, res) => {
  const questionId = parseInt(req.params.id);
  const updatedQuestion = req.body;
  const index = db.questions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    db.questions[index] = { ...db.questions[index], ...updatedQuestion };
    fs.writeFileSync('./config/db.json', JSON.stringify(db));
    res.status(200).json(db.questions[index]);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

// Delete a question
router.delete('/questions/:id', isAdmin, (req, res) => {
  const questionId = parseInt(req.params.id);
  const index = db.questions.findIndex(q => q.id === questionId);
  if (index !== -1) {
    const deletedQuestion = db.questions.splice(index, 1);
    fs.writeFileSync('./config/db.json', JSON.stringify(db));
    res.status(200).json(deletedQuestion);
  } else {
    res.status(404).json({ message: 'Question not found' });
  }
});

module.exports = router;
