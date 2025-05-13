'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'admin@admin.com' && password === 'admin123') {
      localStorage.setItem('user', JSON.stringify({
        role: 'admin',
        email: email,
        username: 'admin'
      }));
      router.push('/dashboard');
    } else {
      try {
        const res = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
        const users = res.data;

        const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (user && password === user.username) {
          localStorage.setItem('user', JSON.stringify({
            role: 'user',
            email: user.email,
            username: user.username,
            id: user.id
          }));
          router.push('/myposts');
        } else {
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Login error', error);
        alert('An error occurred during login');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-center mt-4 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
          
