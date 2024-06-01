const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const quizRoutes = require('./routes/quizRoutes');
const quizController = require('./controllers/quizController');
const adminController = require('./controllers/adminController');
const authController = require('./controllers/authController').router;
const { verifyToken } = require('./controllers/authController');
const keys = require('./config/keys');

const db = keys.mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(quizRoutes);

app.use('/api/auth', authController);
app.use('/api/quiz', verifyToken, quizRoutes);

app.post('/api/quiz/start', verifyToken, quizController.startQuiz);
app.get('/api/quiz/start', quizController.startQuiz);
app.post('/api/quiz/submit', verifyToken, quizController.submitQuiz);
app.use('/api/admin', verifyToken, adminController);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
