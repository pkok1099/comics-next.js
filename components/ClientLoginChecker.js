'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
import LoginDialog from '@/components/LoginDialog'; // Komponen popup login

const ClientLoginChecker = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie;
    const userCookie =
      cookies &&
      cookies.split(';').find((cookie) => cookie.trim().startsWith('user='));

    if (userCookie) {
      setIsLoggedIn(true);
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (username) => {
    // Simulasi login sukses
    Cookie.set('user', username);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  if (!isLoggedIn && showLogin) {
    return <LoginDialog onLogin={handleLogin} />;
  }

  return <>{children}</>;
};

export default ClientLoginChecker;
