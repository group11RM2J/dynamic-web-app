// lib/api.ts
import { User } from '@/types/user';
import { Post } from '@/types/post';
import { Comment } from '@/types/comment';

// USERS
// src/lib/api.ts

export async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getUser(id: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// POSTS
export async function getUserPosts(userId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPostComments(postId: string) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
  return res.json();
};


