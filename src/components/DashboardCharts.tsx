'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ApexOptions } from 'apexcharts';
import Link from 'next/link';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    city: string;
  };
}

export default function DashboardCharts() {
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setUserCount(data.length);
      });

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(res => res.json())
      .then(data => setPostCount(data.length));

    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(res => res.json())
      .then(data => setCommentCount(data.length));
  }, []);

  const pieOptions: ApexOptions = {
    labels: ['Users', 'Posts', 'Comments'],
    legend: { position: 'bottom' },
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
  };

  const pieSeries = [userCount, postCount, commentCount];

  const barOptions: ApexOptions = {
    chart: { type: 'bar' },
    xaxis: { categories: ['Users', 'Posts', 'Comments'] },
    title: {
      text: 'Counts Overview (Bar Chart)',
      align: 'center',
      style: { fontSize: '20px' },
    },
    colors: ['#6366f1'],
  };

  const barSeries = [
    {
      name: 'Count',
      data: [userCount, postCount, commentCount],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-10">
      {/* User Directory Section */}
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">User Directory</h1>

      <Card className="max-w-7xl mx-auto mb-10 shadow-lg rounded-2xl bg-blue-50 p-6">
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link href={`/users/${user.id}`} key={user.id}>
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-gray-200">
                  <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-600">{user.address.street}, {user.address.city}</p>
                  <p className="text-sm text-blue-500 hover:underline">{user.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Overview Section */}
      <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Dashboard Overview</h1>

      {/* Counters */}
      <div className="flex justify-center gap-4 mb-8">
        <Button variant="default">Users: {userCount}</Button>
        <Button variant="secondary">Posts: {postCount}</Button>
        <Button variant="outline">Comments: {commentCount}</Button>
      </div>

      {/* Pie Chart */}
      <Card className="max-w-4xl mx-auto mb-10 shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-center">User vs Post vs Comment (Pie)</h2>
          <Chart options={pieOptions} series={pieSeries} type="pie" height={350} />
        </CardContent>
      </Card>

      {/* Bar/Column Chart */}
      <Card className="max-w-4xl mx-auto shadow-lg rounded-2xl">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-center">Counts Overview (Bar)</h2>
          <Chart options={barOptions} series={barSeries} type="bar" height={350} />
        </CardContent>
      </Card>
    </main>
  );
}
