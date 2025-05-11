'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

interface UserSession {
  username: string;
  email: string;
  role: string;
  id: number;
}

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [openPostId, setOpenPostId] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!localUser?.email) {
      router.push('/login');
      return;
    }

    setUser(localUser);

    const fetchMyPosts = async () => {
      const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
      const userPosts = res.data.filter((post: Post) => post.userId === localUser.id);
      setPosts(userPosts);

      const commentsRes = await axios.get('https://jsonplaceholder.typicode.com/comments');
      setComments(commentsRes.data);
    };

    fetchMyPosts();
  }, [router]);

  const toggleComments = (postId: number) => {
    setOpenPostId(openPostId === postId ? null : postId);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with user info and logout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 p-6 rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="mb-4 sm:mb-0">
            {user && (
              <>
                <p className="text-2xl font-semibold text-blue-800">{`Hello, ${user.username}`}</p>
                <p className="text-sm text-gray-600">{`Email: ${user.email}`}</p>
                <p className="text-sm text-gray-500">{`Role: ${user.role}`}</p>
              </>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">My Posts</h1>

        {posts.length === 0 ? (
          <p className="text-xl text-gray-500 text-center">No posts found.</p>
        ) : (
          posts.map((post) => {
            const postComments = comments.filter((comment) => comment.postId === post.id);

            return (
              <div key={post.id} className="mb-6">
                <Link
                  href={`/posts/${post.id}`}
                  className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200"
                >
                  <h2 className="text-2xl font-semibold text-blue-900">{post.title}</h2>
                  <p className="text-gray-700 mt-2">{post.body}</p>
                </Link>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {openPostId === post.id ? 'Hide Comments' : 'Show Comments'}
                </button>

                {openPostId === post.id && postComments.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {postComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-100 p-4 rounded-lg border border-gray-200"
                      >
                        <p className="font-semibold text-gray-800">{comment.name}</p>
                        <p className="text-gray-700">{comment.body}</p>
                        <p className="text-sm text-gray-500">By: {comment.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
