import Link from 'next/link';

async function getFlatsData() {
  const res = await fetch('http://localhost:13000/');
  if (!res.ok) {
    throw new Error('Failed to fetch flats data');
  }
  return res.json();
}

export default async function Home() {
  const flats = await getFlatsData();

  return (
    <div>
      <h1>Available Flats</h1>
      <ul>
        {flats.map((flat: { id: string; name: string }) => (
          <li key={flat.id}>
            <Link href={`/flats/${flat.id}`}>
              {flat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}