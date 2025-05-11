'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '@/lib/api';
import { User } from '@/types/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface LoggedInUser {
  username: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email && storedUser?.role) {
      setCurrentUser(storedUser);
    } else {
      router.replace('/login');
    }

    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* 👤 Logged-in User Info + Logout */}
        {currentUser && (
          <div className="bg-white shadow-md p-6 rounded-xl mb-6 border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-blue-700">Welcome, {currentUser.username}</h2>
              <p className="text-gray-600"><span className="font-semibold">Email:</span> {currentUser.email}</p>
              <p className="text-gray-600"><span className="font-semibold">Role:</span> {currentUser.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </Button>
          </div>
        )}

        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">User Directory</h1>

        {/* 📊 Chart Button */}
        <div className="flex justify-end mb-6">
          <Link href="/dashboard-charts">
            <Button variant="outline" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800">
              📊 View Overall Stats
            </Button>
          </Link>
        </div>

        {/* 👥 User Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 shadow-md rounded-xl">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </Card>
            ))
          ) : (
            users.map(user => (
              <Link key={user.id} href={`/users/${user.id}`}>
                <Card className="hover:shadow-xl transition-shadow duration-200 border border-gray-200 rounded-xl cursor-pointer bg-white">
                  <CardContent className="p-5 space-y-2">
                    <p className="font-bold text-lg text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.address.street}, {user.address.city}
                    </p>
                    <p className="text-sm text-blue-600">{user.email}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
