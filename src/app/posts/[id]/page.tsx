import Map, { Marker } from "react-map-gl";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    city: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

async function getUser(id: string): Promise<User | null> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) return null;
  return res.json();
}

async function getPostsByUser(id: string): Promise<Post[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
  return res.json();
}

async function getCommentsByPost(postId: number): Promise<Comment[]> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return res.json();
}

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  if (!user) {
    return <div className="p-6 text-center text-red-500">User not found</div>;
  }

  const posts = await getPostsByUser(params.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-gray-700">@{user.username}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Website: {user.website}</p>
        <p>Company: {user.company.name}</p>
        <p>City: {user.address.city}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">User Location</h2>
      <div className="h-64 w-full rounded-xl overflow-hidden mb-8">
      <Map
        mapboxAccessToken="pk.eyJ1IjoibGFicy1zYW5kYm94IiwiYSI6ImNrMTZuanRmZDA2eGQzYmxqZTlnd21qY3EifQ.Q7DM5HqE5QJzDEnCx8BGFw"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        initialViewState={{
          latitude: parseFloat(user.address.geo.lat),
          longitude: parseFloat(user.address.geo.lng),
          zoom: 10,
        }}
        style={{ width: "100%", height: "100%" }} // <-- Set style inside style prop
      >
        <Marker
          latitude={parseFloat(user.address.geo.lat)}
          longitude={parseFloat(user.address.geo.lng)}
        />
      </Map>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <div className="space-y-6">
        {posts.map(async (post) => {
          const comments = await getCommentsByPost(post.id);
          return (
            <div
              key={post.id}
              className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl shadow-sm"
            >
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.body}</p>

              <div className="ml-4 space-y-2">
                <p className="font-medium">Comments:</p>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-white border rounded">
                      <p className="font-semibold">{comment.name}</p>
                      <p className="text-sm text-gray-500">{comment.email}</p>
                      <p className="mt-1">{comment.body}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments found.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
