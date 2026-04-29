'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
      router.push('/dashboard');
    }
  }, []);

  const handleLogin = () => {
    if (password === 'Tivra@2025') {
      sessionStorage.setItem('admin_logged_in', 'true');
      router.push('/dashboard');
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <h2>Admin Access</h2>
        <p>Enter password to access dashboard</p>
        
        <div className="input-group">
          <label><i className="fas fa-lock"></i> Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              autoFocus
            />
            <i
              onClick={() => setShowPassword(!showPassword)}
              className={`fas toggle-password ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
            ></i>
          </div>
        </div>
        
        <button onClick={handleLogin} className="login-btn">
          <i className="fas fa-arrow-right-to-bracket"></i> Login
        </button>
        
        <div className={`error-msg ${error ? 'show' : ''}`}>
          <i className="fas fa-exclamation-triangle"></i> Incorrect password. Please try again.
        </div>
      </div>
    </div>
  );
}