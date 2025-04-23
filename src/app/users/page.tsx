import Link from 'next/link';

export default async function UsersPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await res.json();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.map((user: any) => (
        <div key={user.id} className="p-4 bg-white shadow rounded">
          <Link href={`/users/${user.id}`}>
            <div className="cursor-pointer hover:underline">
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}