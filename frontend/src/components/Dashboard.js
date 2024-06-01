import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSignout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const viewResults = () => {
    navigate('/dashboard/results');
  };

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Dashboard</h1>
        </div>
        <div className="card-body">
          <p>Welcome, {user.email}</p>
          <div className="d-grid gap-2">
            <button onClick={handleSignout} className="btn btn-danger">
              Sign out
            </button>
            {user.role !== 'admin' && (
              <>
                <button onClick={handleStartQuiz} className="btn btn-primary">
                  Start Quiz
                </button>
                <button onClick={viewResults} className="btn btn-secondary">
                  View Results
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
