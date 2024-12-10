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
  const router = useRouter();

  // Fungsi untuk menangani login melalui API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Menyimpan cookie setelah login sukses
        document.cookie = `user=${username}; max-age=${365 * 24 * 60 * 60}; path=/`;
        router.push('/'); // Redirect ke halaman utama
      } else {
        const data = await response.json();
        setErrorMessage(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Terjadi kesalahan saat mencoba login');
    }
  };

  return (
    <Card className='mx-auto max-w-sm'>
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
            <Button type='submit' className='w-full'>
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}