import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GPF_User from '../types/Interfaces';

interface LoginProps {
    endpoint: string
    updateUserStateFunc: (user: GPF_User) => void
}

const Login: React.FC<LoginProps> = (props: LoginProps ) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(props.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        }),
    })

    if (response.ok) {
      console.log(await response.json())

      setIsSuccess(true);
      setMessage('Login Successful');
      const updatedUser: GPF_User = {role: '', token: '', isAuthenticated: true};
      props.updateUserStateFunc(updatedUser)
      navigate('/dashboard'); 
    } else {
      setIsSuccess(false);
      setMessage('Login Failed');
    }
  };

  return (
    <div className="card p-4 shadow" style={{ width: '400px' }}>
      <div className="text-center mb-4">
        <img
          src="/src/assets/gfp.webp"
          alt="Brand Logo"
          style={{ width: '80px', height: '80px' }}
          className="d-inline-block align-top"
        />
      </div>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
        {message && (
        <div className={`alert mt-4 ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
        )}
      </form>
    </div>
  );
};

export default Login;