export async function getAllTics() {
  const url = process.env.NODE_ENV === 'production' ? 'TBD' : 'http://localhost:3001/api/all-tics';

  try {
    let res = await fetch(url);
    return await res.json();
  } catch {
    return [];
  }
}
