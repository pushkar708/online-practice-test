import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email, password };
    axios.post('http://localhost:5000/api/users/login', user)
      .then(res => {
        localStorage.setItem('jwtToken', res.data.token);
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.data) {
          alert(err.response.data.message || 'An error occurred');
        }
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href="/signup">Don't have an account? Sign Up</a>
    </div>
  );
};

export default Login;
