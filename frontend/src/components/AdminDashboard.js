import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AdminDashboard.css';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '', tags: [], difficulty: 1 });
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await axios.post('http://localhost:5000/questions', newQuestion);
      fetchQuestions();
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', tags: [], difficulty: 1 });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const handleUpdateQuestion = async (id, updatedQuestion) => {
    try {
      await axios.put(`http://localhost:5000/questions/${id}`, updatedQuestion);
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/questions/${id}`);
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="admincontainer my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <ul className="nav nav-tabs">
        <li className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}>
          <a
            className="nav-link"
            onClick={() => setActiveTab('add')}
            href="#"
          >
            Add Question
          </a>
        </li>
        <li className={`nav-item ${activeTab === 'edit' ? 'active' : ''}`}>
          <a
            className="nav-link"
            onClick={() => setActiveTab('edit')}
            href="#"
          >
            Edit Question
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div
          className={`tab-pane fade ${activeTab === 'add' ? 'show active' : 'fade'}`}
          id="add-question"
        >
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Create New Question</h3>
            </div>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label className="form-label margin-r-2 label-admin">Question:</label>
                  <input type="text" className="form-control" placeholder="Question" value={newQuestion.question} onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} />
                </div>
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="form-group d-flex">
                    <label className="form-label label-admin">Option {index + 1}:</label>
                    <input type="text" className="form-control  margin-r-2 label-admin" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => {
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
                <button onClick={handleCreateQuestion} className="btn btn-primary">Create Question</button>
              </form>
            </div>
          </div>
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'edit' ? 'show active' : 'fade'}`}
          id="edit-question"
        >
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Existing Questions</h3>
            </div>
            <div className="card-body">
              <ul className="list-group">
                {questions.map((question) => (
                  <li key={question.id} className="list-group-item">
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label margin-r-2 label-admin">Question:</label>
                        <input type="text" className="form-control" value={question.question} onChange={(e) => handleUpdateQuestion(question.id, { ...question, question: e.target.value })} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label margin-r-2 label-admin">Options:</label>
                        {question.options.map((option, index) => (
                          <input key={index} type="text" className="form-control margin-r-2 label-admin" value={option} onChange={(e) => {
                            const options = [...question.options];
                            options[index] = e.target.value;
                            handleUpdateQuestion(question.id, { ...question, options });
                          }} />
                        ))}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label margin-r-2 label-admin">Correct Answer:</label>
                        <input type="text" className="form-control" value={question.correctAnswer} onChange={(e) => handleUpdateQuestion(question.id, { ...question, correctAnswer: e.target.value })} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label margin-r-2 label-admin">Tags:</label>
                        <input type="text" className="form-control" value={question.tags.join(', ')} onChange={(e) => handleUpdateQuestion(question.id, { ...question, tags: e.target.value.split(',').map(tag => tag.trim()) })} />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label margin-r-2 label-admin">Difficulty:</label>
                        <input type="number" className="form-control" value={question.difficulty} onChange={(e) => handleUpdateQuestion(question.id, { ...question, difficulty: parseInt(e.target.value) })} />
                      </div>
                      <div className="d-flex justify-content-end">
                        <button onClick={() => handleDeleteQuestion(question.id)} className="btn btn-danger">Delete</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;