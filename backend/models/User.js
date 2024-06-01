const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required:true,
    default: "user"
  },
  
});

module.exports = mongoose.model('users', UserSchema);
