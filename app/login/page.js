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
    if (
      username === 'alamak' &&
      password === 'mupar'
    ) {
      // Set cookie after successful login
      Cookie.set('user', username);
      router.push('/'); // Redirect to home page
    } else {
      setError(
        'Username or Password is incorrect',
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>
        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
