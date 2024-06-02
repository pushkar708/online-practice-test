import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AdminDashboard.css';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '', tags: [], difficulty: 1 });
  const [activeTab, setActiveTab] = useState('add');
  const [editedQuestions, setEditedQuestions] = useState({});

  useEffect(() => {
    fetchQuestions();
    if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  function toTitleCase(str) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5000/results');
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await axios.post('http://localhost:5000/questions', newQuestion);
      fetchQuestions();
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', tags: [], difficulty: 1 });
      Swal.fire('Success', 'Question created successfully!', 'success');
    } catch (error) {
      console.error('Error creating question:', error);
      Swal.fire('Error', 'Error creating question.', 'error');
    }
  };

  const handleEditChange = (id, field, value, index = null) => {
    const updatedQuestion = questions.find(q => q.id === id);
    if (index !== null) {
      updatedQuestion.options[index] = value;
    } else {
      updatedQuestion[field] = value;
    }
    setEditedQuestions({ ...editedQuestions, [id]: updatedQuestion });
  };
  

  const handleSaveChanges = async () => {
    try {
      const updatePromises = Object.values(editedQuestions).map(question =>
        axios.put(`http://localhost:5000/questions/${question._id}`, question)
      );
      await Promise.all(updatePromises);
      fetchQuestions();
      setEditedQuestions({});
      Swal.fire('Success', 'Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Error updating questions:', error);
      Swal.fire('Error', 'Error saving changes.', 'error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/questions/${id}`);
      fetchQuestions();
      Swal.fire('Success', 'Question deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting question:', error);
      Swal.fire('Error', 'Error deleting question.', 'error');
    }
  };

  return (
    <div className="admincontainer my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <ul className="nav nav-tabs">
        <li className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}>
          <a className="nav-link" onClick={() => setActiveTab('add')} href="#">
            Add Question
          </a>
        </li>
        <li className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`}>
          <a className="nav-link" onClick={() => setActiveTab('edit')} href="#">
            Edit Question
          </a>
        </li>
        <li className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}>
          <a className="nav-link" onClick={() => setActiveTab('results')} href="#">
            Results
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === 'add' ? 'show active' : 'fade'}`} id="add-question">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Create New Question</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group d-flex">
                  <label className="form-label margin-r-2 label-admin">Question:</label>
                  <input type="text" className="form-control" placeholder="Question" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} />
                </div>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="form-group d-flex">
                    <label className="form-label label-admin margin-r-2">Option {index + 1}:</label>
                    <input type="text" className="form-control margin-r-2 label-admin" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => {
                      const options = [...newQuestion.options];
                      options[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, options });
                    }} />
                  </div>
                ))}
                <div className="form-group d-flex">
                  <label className="form-label margin-r-2 label-admin">Correct Answer:</label>
                  <input type="text" className="form-control" placeholder="Correct Answer" value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} />
                </div>
                <div className="form-group d-flex">
                  <label className="form-label margin-r-2 label-admin">Tags:</label>
                  <input type="text" className="form-control" placeholder="Tags" value={newQuestion.tags.join(', ')} onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value.split(',').map(tag => tag.trim()) })} />
                </div>
                <div className="form-group d-flex">
                  <label className="form-label margin-r-2 label-admin">Difficulty:</label>
                  <input type="number" className="form-control" placeholder="Difficulty" value={newQuestion.difficulty} onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) })} />
                </div>
                <button type="button" onClick={handleCreateQuestion} className="btn btn-primary">Create Question</button>
              </form>
              <button onClick={handleSignout} className="btn btn-danger">
                Sign out
              </button>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${activeTab === 'edit' ? 'show active' : 'fade'}`} id="edit-question">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Existing Questions</h3>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {questions.map((question) => (
                  <li key={question.id} className="list-group-item">
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label margin-r-2 label-admin">Question:</label>
                        <input type="text" className="form-control" value={question.question} onChange={(e) => handleEditChange(question.id, 'question', e.target.value)} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label margin-r-2 label-admin">Options:</label>
                        {question.options.map((option, index) => (
                          <input key={index} type="text" className="form-control margin-r-2 label-admin" value={option} onChange={(e) => handleEditChange(question.id, 'options', e.target.value, index)} />
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label margin-r-2 label-admin">Correct Answer:</label>
                        <input type="text" className="form-control" value={question.correctAnswer} onChange={(e) => handleEditChange(question.id, 'correctAnswer', e.target.value)} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label margin-r-2 label-admin">Tags:</label>
                        <input type="text" className="form-control" value={question.tags.join(', ')} onChange={(e) => handleEditChange(question.id, 'tags', e.target.value.split(',').map(tag => tag.trim()))} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label margin-r-2 label-admin">Difficulty:</label>
                        <input type="number" className="form-control" value={question.difficulty} onChange={(e) => handleEditChange(question.id, 'difficulty', parseInt(e.target.value))} />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="button" onClick={() => handleDeleteQuestion(question._id)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={handleSaveChanges} className="btn btn-success mt-3">Submit Changes</button>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${activeTab === 'results' ? 'show active' : 'fade'}`} id="results">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Statistics</h3>
          </div>
          <div className="card-body"> 
            <table className="table">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Tag</th>
                  <th>Total Questions</th>
                  <th>Correct Answers</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.email}</td>
                    <td>{toTitleCase(result.tag)}</td>
                    <td>{result.totalQuestions}</td>
                    <td>{result.correctAnswers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              <button onClick={handleSignout} className="btn btn-danger">
                Sign out
              </button>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
