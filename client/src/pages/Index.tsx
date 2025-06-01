
import React, { useState, useEffect } from 'react';
import AuthPage from '../components/AuthPage';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const savedPhoneNumber = localStorage.getItem('phoneNumber');
    if (savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (phone: string) => {
    setPhoneNumber(phone);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('phoneNumber');
    setIsAuthenticated(false);
    setPhoneNumber('');
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <Dashboard phoneNumber={phoneNumber} onLogout={handleLogout} />;
};

export default Index;
