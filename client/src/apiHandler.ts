export async function getAllTics() {
  const url = process.env.NODE_ENV === 'production' ? 'TBD' : 'http://localhost:3001/api/all-tics';

  try {
    let res = await fetch(url);
    return await res.json();
  } catch {
    return [];
  }
}

export async function getTic(ticId: string) {
  const url = process.env.NODE_ENV === 'production' ? 'TBD' : `http://localhost:3001/api/tic/${ticId}`;

  let res = await fetch(url, {
    method: 'GET',
  });

  if (res.status === 200) {
    return await res.json();
  }

  return null;
}
