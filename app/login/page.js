'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'alamak' && password === 'mupar') {
      // Set cookie after successful login
      Cookie.set('user', username);
      router.push('/'); // Redirect to home page
    } else {
      setError('Username or Password is incorrect');
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='w-96 rounded-md bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-center text-2xl font-bold'>Login</h2>
        {error && <p className='mb-4 text-red-500'>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type='text'
            placeholder='Username'
            className='mb-4 w-full rounded-md border border-gray-300 p-2'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            className='mb-4 w-full rounded-md border border-gray-300 p-2'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type='submit'
            className='w-full rounded-md bg-blue-500 p-2 text-white'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
