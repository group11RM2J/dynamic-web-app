import Link from "next/link";

interface Post {
  id: number;
  title: string;
  body: string;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return res.json();
}

export default async function PostListPage() {
  const posts = await getPosts();

  return (
    <div className="mt-4 space-y-4">
  {posts.map((post) => (
    <Link
      key={post.id}
      href={`/posts/${post.id}`}
      className="block bg-yellow-50 border border-yellow-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <h3 className="font-semibold text-lg text-yellow-800">{post.title}</h3>
      <p className="text-gray-700">{post.body}</p>
    </Link>
  ))}
</div>
  );
}
