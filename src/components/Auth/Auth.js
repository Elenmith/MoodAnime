import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import Login from './Login';
import Register from './Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Redirect to profile if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default Auth;
