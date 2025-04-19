import { notFound } from 'next/navigation';
import UserPosts from './UserPosts';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string };
  company: { name: string };
}

interface Post {
  id: number;
  title: string;
  body: string;
}

async function getUser(id: string): Promise<User | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function getPosts(id: string): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
  return res.json();
}

export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const posts = await getPosts(params.id);

  if (!user) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-gray-600">@{user.username}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Website: {user.website}</p>
        <p>Company: {user.company.name}</p>
        <p>City: {user.address.city}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Posts</h2>
        <UserPosts posts={posts} />
      </div>
    </div>
  );
}
