'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return res.json();
}

export default function PostListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProtect = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user?.email) {
        router.push('/login'); // 🚨 Not logged in
        return;
      }

      const fetchedPosts = await getPosts();

      if (user.role === 'admin') {
        setPosts(fetchedPosts); // Admin sees all posts
      } else {
        const userPosts = fetchedPosts.filter((post) => post.userId === user.id);
        setPosts(userPosts); // User sees only their posts
      }

      setLoading(false);
    };

    fetchAndProtect();
  }, [router]);

  if (loading) {
    return <div className="p-4 text-center">Loading posts...</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block bg-yellow-50 border border-yellow-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h3 className="font-semibold text-lg text-yellow-800">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
          </Link>
        ))
      )}
    </div>
  );
}
