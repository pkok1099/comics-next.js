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

export function RegisterForm({
  username,
  password,
  confirmPassword,
  setUsername,
  setPassword,
  setConfirmPassword,
  onSubmit,
  errorMessage,
  loading,
}: FormProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='register-username'>Username</Label>
              <Input
                id='register-username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Choose a username'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='register-password'>Password</Label>
              <Input
                id='register-password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Choose a password'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='confirm-password'>Confirm Password</Label>
              <Input
                id='confirm-password'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword?.(e.target.value)}
                placeholder='Confirm your password'
              />
            </div>
            {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
          </div>
          <Button type='submit' className='mt-5 w-full' disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
