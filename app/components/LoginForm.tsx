'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormProps } from './login';

export function LoginForm({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit,
  errorMessage,
  loading,
}: FormProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='login-username'>Username</Label>
              <Input
                id='login-username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter your username'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='login-password'>Password</Label>
              <Input
                id='login-password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
              />
            </div>
            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          </div>
          <Button type='submit' className='mt-5 w-full' disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
