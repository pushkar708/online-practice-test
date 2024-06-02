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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const session = require('express-session');

const db = keys.mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

passport.use(new GoogleStrategy({
  clientID: keys.GOOGLE_CLIENT_ID,
  clientSecret: keys.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
(accessToken, refreshToken, profile, done) => {
  // This callback function handles the user's profile data received from Google
  // You can save the user to your database or perform other actions here
  return done(null, profile);
}
));

app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend URL
  credentials: true // Allows cookies to be sent along with the request (if needed)
}));

app.use(session({
  secret: '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', // Replace with a secret key for session encryption
  resave: false,
  saveUninitialized: true
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(quizRoutes);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authController);
app.use('/api/quiz', verifyToken, quizRoutes);

app.post('/api/quiz/start', verifyToken, quizController.startQuiz);
app.get('/api/quiz/start', quizController.startQuiz);
app.post('/api/quiz/submit', verifyToken, quizController.submitQuiz);
app.use('/api/admin', verifyToken, adminController);
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the frontend with authentication token
    const token = generateAuthToken(req.user); // You should implement this function to generate a JWT token
    const redirectUrl = `http://localhost:3000?token=${token}`;
    res.redirect(redirectUrl);
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
