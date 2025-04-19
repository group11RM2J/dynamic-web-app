

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
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return res.json();
}

async function getComments(id: string): Promise<Comment[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  return res.json();
}

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const comments = await getComments(params.id);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-bold text-indigo-700">{post.title}</h1>
        <p className="text-gray-700 mt-2">{post.body}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">💬 Comments</h2>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 border border-gray-200 p-4 rounded-lg"
          >
            <h3 className="font-medium text-gray-800">{comment.name}</h3>
            <p className="text-sm text-gray-600">{comment.email}</p>
            <p className="text-gray-700 mt-2">{comment.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

