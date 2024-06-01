const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: String,
  options: [String],
  answer: String,
  correctAnswer: String,
  difficulty: Number,
  tags: [String]
});

module.exports = Question = mongoose.model('questions', QuestionSchema);
