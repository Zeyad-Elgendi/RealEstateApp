async function getFlatData(id: string) {
  const res = await fetch(`http://localhost:13000/flat/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch flat data');
  }
  return res.json();
}

export default async function FlatDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const flat = await getFlatData(id);

  return (
    <div>
      <h1>{flat.name}</h1>
      <p>{flat.address}</p>
      <p>{flat.price}</p>
      <p>{flat.downPayment}</p>
      <p>{flat.installmentYears}</p>
      <p>{flat.area}</p>
      <p>{flat.reference_no}</p>
      <p>{flat.downPayment}</p>
    </div>
  );
}