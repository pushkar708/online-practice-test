const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { startQuiz, submitQuiz } = require('../controllers/quizController');



router.get('/start', quizController.startQuiz);
router.post('/submit', quizController.submitQuiz);

router.get('/api/quiz/start', startQuiz);
router.post('/api/quiz/submit', submitQuiz);

// Admin routes for CRUD operations
router.get('/questions', quizController.getQuestions);
router.get('/results', quizController.getAllResults);
router.post('/questions', quizController.createQuestion);
router.put('/questions/:id', quizController.updateQuestion);
router.delete('/questions/:id', quizController.deleteQuestion);
router.get('/users/:email/quizzes', quizController.getQuizResults);

module.exports = router;
