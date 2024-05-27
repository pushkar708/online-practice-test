import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState('quiz');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => handleTabChange('quiz')}
            >
              Quiz
            </button>
            <button
              className={`list-group-item list-group-item-action ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => handleTabChange('results')}
            >
              Results
            </button>
            {userRole === 'admin' && (
              <button
                className={`list-group-item list-group-item-action ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                Users
              </button>
            )}
          </div>
        </div>
        <div className="col-md-9">
          {activeTab === 'quiz' && (
            <div className="card text-center">
              <div className="card-header">
                <h2>Quiz</h2>
              </div>
              <div className="card-body">
                <p className="card-text">Welcome to the quiz dashboard. Click the button below to start the quiz.</p>
                <Link to="/quiz" className="btn btn-primary">Start Quiz</Link>
              </div>
            </div>
          )}
          {activeTab === 'results' && (
            <div className="card text-center">
              <div className="card-header">
                <h2>Results</h2>
              </div>
              <div className="card-body">
                <p className="card-text">This is the result section.</p>
                {/* Your result content here */}
              </div>
            </div>
          )}
          {activeTab === 'users' && userRole === 'admin' && (
            <div className="card text-center">
              <div className="card-header">
                <h2>Users</h2>
              </div>
              <div className="card-body">
                {/* Display users from the database */}
                <p className="card-text">List of users</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
