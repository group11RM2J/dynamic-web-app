'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '@/lib/api';
import { User } from '@/types/user';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">User Directory</h1>

        {/* 📊 Chart Button */}
        <div className="flex justify-end mb-6">
          <Link href="/dashboard-charts">
            <Button variant="outline" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800">
              📊 View Overall Stats
            </Button>
          </Link>
        </div>

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
