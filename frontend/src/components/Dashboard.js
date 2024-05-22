import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card text-center">
            <div className="card-header">
              <h2>Dashboard</h2>
            </div>
            <div className="card-body">
              <p className="card-text">Welcome to the quiz dashboard. Click the button below to start the quiz.</p>
              <Link to="/quiz" className="btn btn-primary">Start Quiz</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
