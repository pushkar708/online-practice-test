// adminController.js

const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Result = require('../models/Result');
const { isAdmin } = require('../middleware/authMiddleware');

// Fetch all questions
router.get('/questions', isAdmin, async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new question
router.post('/questions', isAdmin, async (req, res) => {
  const newQuestion = req.body;
  try {
    const createdQuestion = await Question.create(newQuestion);
    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a question
router.put('/questions/:id', isAdmin, async (req, res) => {
  const questionId = req.params.id;
  const updatedQuestion = req.body;
  try {
    const question = await Question.findByIdAndUpdate(questionId, updatedQuestion, { new: true });
    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a question
router.delete('/questions/:id', isAdmin, async (req, res) => {
  const questionId = req.params.id;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (deletedQuestion) {
      res.status(200).json(deletedQuestion);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all results
router.get('/results', async (req, res) => {
  try {
    const results = await Result.find(); // Fetch all results from MongoDB
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
