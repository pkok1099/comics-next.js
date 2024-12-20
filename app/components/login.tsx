'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useAuth } from '@/utils/handleSubmit'; // Import hook custom
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';

const LoginPage = () => {
  const {
    isLogin,
    loading,
    errorMessage,
    username,
    password,
    confirmPassword,
    setUsername,
    setPassword,
    setConfirmPassword,
    toggleMode,
    handleSubmit,
  } = useAuth();

  return (
    <div className='mx-auto w-full max-w-md overflow-hidden'>
      <div className='relative w-full' style={{ height: '400px' }}>
        <div
          className={`absolute left-0 top-0 h-full w-full transition-transform duration-300 ease-in-out ${
            isLogin ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            errorMessage={errorMessage}
            loading={loading}
          />
        </div>
        <div
          className={`absolute left-0 top-0 h-full w-full transition-transform duration-300 ease-in-out ${
            isLogin ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <RegisterForm
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            setUsername={setUsername}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleSubmit}
            errorMessage={errorMessage}
            loading={loading}
          />
        </div>
      </div>
      <div className='mt-4 text-center'>
        <Button variant='link' onClick={toggleMode}>
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </Button>
      </div>
    </div>
  );
};

// Komponen Form
export interface FormProps {
  username: string;
  password: string;
  confirmPassword?: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword?: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  errorMessage: string;
  loading: boolean;
}

export default LoginPage;
