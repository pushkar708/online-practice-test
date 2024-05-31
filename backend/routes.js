const express = require('express');
const router = express.Router();
const { startQuiz, submitQuiz } = require('./controllers/quizController');
const { signup, login } = require('./controllers/authController');

// Quiz routes
router.get('/api/quiz/start', startQuiz);
router.post('/api/quiz/submit', submitQuiz);

// Auth routes
router.post('/api/auth/signup', signup);
router.post('/api/auth/login', login);

module.exports = router;
