export async function getTicFiles(ticId: string) {
  const url = process.env.NODE_ENV === 'production' ? '/api/getTicFiles/' + ticId : 'http://localhost:3001/api/getTicFiles/' + ticId;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch {
    return null;
  }
}
