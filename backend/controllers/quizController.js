const User = require('../models/User');
const Question = require('../models/Question');
const Result = require('../models/Result');

// Define route handler for starting the quiz
exports.startQuiz = async (req, res) => {
  try {
    // Get a random sample of 20 questions
    const questions = await Question.aggregate([
      { $sample: { size: 20 } }
    ]);

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getQuizResults = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const user = await User.findOne({ email: userEmail });
    const userId = user._id.toString();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }else{
      const results = await Result.find({ userId: userId})
      res.json(results);
    }

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.submitQuiz = async (req, res) => {
  const { userId, answers } = req.body;

  try {
    // Calculate correct answers
    let correctAnswersPerTag = {};
    let totalQuestionsPerTag = {};

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      if (!question) {
        return res.status(400).json({ message: `Question with ID ${answer.questionId} not found` });
      }
      question.tags.forEach(tag => {
        if (!correctAnswersPerTag[tag]) {
          correctAnswersPerTag[tag] = 0;
        }
        if (!totalQuestionsPerTag[tag]) {
          totalQuestionsPerTag[tag] = 0;
        }

        // Count the total questions for each tag
        totalQuestionsPerTag[tag]++;

        // Count the correct answers for each tag
        if (question.correctAnswer === answer.answer) {
          correctAnswersPerTag[tag]++;
        }
      });
    }

    // Fetch existing results for the user
    let existingResults = await Result.find({ userId });

    // Update existing results and create new results as needed
    for (const [tag, totalQuestions] of Object.entries(totalQuestionsPerTag)) {
      const correctAnswers = correctAnswersPerTag[tag];
      let existingResult = existingResults.find(result => result.tag === tag);
      if (existingResult) {
        // Update existing result
        existingResult.totalQuestions += totalQuestions;
        existingResult.correctAnswers += correctAnswers;
        await existingResult.save();
      } else {
        // Create a new result for this tag
        const newResult = new Result({
          userId,
          tag,
          totalQuestions,
          correctAnswers
        });
        await newResult.save();
      }
    }

    // Fetch updated results to return in response
    existingResults = await Result.find({ userId });
    return res.status(200).json(existingResults);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin CRUD operations
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body);
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json(deletedQuestion);
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find(); // Fetch all results from MongoDB

    const resultsWithEmail = await Promise.all(results.map(async (element) => {
      try {
        const user = await User.findOne({ _id: element.userId });
        const email = user ? user.email : 'Email not found';
        return { ...element.toObject(), email };
      } catch (error) {
        console.error('Error finding user:', error);
        return { ...element.toObject(), email: 'Error fetching email' };
      }
    }));

    res.status(200).json(resultsWithEmail);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};