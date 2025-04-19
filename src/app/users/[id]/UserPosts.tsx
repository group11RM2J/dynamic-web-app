'use client';

import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

export default function UserPosts({ posts }: { posts: Post[] }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(res => res.json())
      .then(data => setComments(data));
  }, []);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <details key={post.id} className="bg-white border border-yellow-200 p-5 rounded-xl shadow-sm hover:shadow-md transition duration-300">
          <summary className="font-semibold text-lg text-yellow-800 cursor-pointer">{post.title}</summary>
          <p className="text-gray-700 mt-2">{post.body}</p>

          <div className="mt-4">
            <h4 className="font-medium text-sm text-gray-500 mb-1">💬 Comments:</h4>
            {comments
              .filter((comment) => comment.postId === post.id)
              .map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-3 rounded-md mt-2">
                  <p className="text-sm font-semibold text-gray-800">{comment.name}</p>
                  <p className="text-sm text-gray-600 italic">{comment.email}</p>
                  <p className="text-sm text-gray-700 mt-1">{comment.body}</p>
                </div>
              ))}
          </div>
        </details>
      ))}
    </div>
  );
}
