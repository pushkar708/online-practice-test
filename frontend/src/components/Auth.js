import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
    try {
      const response = await axios.post(url, { email, password });
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        alert('Signup successful, please login');
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error);
      alert('Authentication failed');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Signup'}</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleAuth}>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password:</label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">
                    {isLogin ? 'Login' : 'Signup'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link">
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;