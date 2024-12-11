'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fungsi untuk menangani login melalui API

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Hindari eksekusi ulang jika sedang loading

    setLoading(true); // Aktifkan loading
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        document.cookie = `user=${username}; max-age=${365 * 24 * 60 * 60}; path=/`;
        router.push('/');
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Login gagal');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat mencoba login');
    } finally {
      setLoading(false); // Matikan loading
    }
  };

  return (
    <Card className='mx-auto max-w-sm border-[7px]'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your username and password to login
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                type='text'
                placeholder='Enter your username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && (
              <div className='mt-2 text-sm text-red-500'>{errorMessage}</div>
            )}
            <Button
              type='submit'
              className='flex w-full items-center justify-center'
              disabled={loading}
            >
              {loading ? (
                <div className='flex items-center'>
                  <svg
                    className='mr-2 h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Login'
              )}
            </Button>
            <Button
              type='button'
              className='mt-[-5px] w-full'
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
