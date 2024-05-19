const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const users = require('./routes/users');
const quiz = require('./routes/quiz');
const keys = require('./config/keys'); // Make sure this file contains your MongoDB URI

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// DB Config
const db = keys.mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', users);
app.use('/api/quiz', quiz);

// Get list of databases and collections
app.get("/", async (req, res) => {
  try {
    const client = await mongoose.connection.getClient();
    const adminDb = client.db().admin();

    // Get list of databases
    const dbs = await adminDb.listDatabases();

    const databasesInfo = await Promise.all(dbs.databases.map(async (dbInfo) => {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      return {
        name: dbInfo.name,
        collections: collections.map(col => col.name)
      };
    }));

    res.json(databasesInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving databases and collections');
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
