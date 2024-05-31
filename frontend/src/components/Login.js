import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    axios.post('http://localhost:5000/api/users/login', user)
      .then(res => {
        const token = res.data.token;
        localStorage.setItem('jwtToken', token);
        const userRole = JSON.parse(atob(token.split('.')[1])).role;
        navigate('/dashboard', { state: { userRole } });
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.data) {
          alert(err.response.data.message || 'An error occurred');
        }
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <div className="mt-3">
        <a href="/signup">Don't have an account? Sign Up</a>
      </div>
    </div>
  );
};

export default Login;
