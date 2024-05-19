const express = require('express');
const router = express.Router();

// @route GET api/quiz/questions
// @desc Get quiz questions
router.get('/questions', (req, res) => {
  const questions = [
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: "4",
      difficulty: 1,
      tags: ["arithmetic"]
    },
    {
      question: "What is the area of a rectangle with width 3 and height 4?",
      options: ["7", "10", "12", "15"],
      answer: "12",
      difficulty: 2,
      tags: ["geometry"]
    }
  ];
  res.json(questions);
});

module.exports = router;
