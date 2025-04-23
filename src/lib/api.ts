// lib/api.ts
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  return res.json();
};

export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const getPosts = async (userId?: string): Promise<Post[]> => {
  const res = await fetch(
    userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      : `https://jsonplaceholder.typicode.com/posts`
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};


export const fetchPostById = async (id: string): Promise<Post> => {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return res.json();
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  return res.json();
};
