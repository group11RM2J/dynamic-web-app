// lib/api.ts
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// USERS
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

// POSTS
export const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const fetchPostById = async (id: string): Promise<Post> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  return res.json();
};


