import { auth } from './firebase';

export async function getTicFiles(ticId: string) {
  const url = process.env.NODE_ENV === 'production' ? '/api/getTicFiles/' + ticId : 'http://localhost:3001/api/getTicFiles/' + ticId;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch {
    return null;
  }
}

export async function getRandomEB() {
  const url = process.env.NODE_ENV === 'production' ? '/api/randomEB/' : 'http://localhost:3001/api/randomEB/';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + (await auth.currentUser?.getIdToken()),
      },
    });

    if (response.status === 401) {
      return { unauthorized: true };
    }

    if (response.status !== 200) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function getEB(ticId: string) {
  const url = process.env.NODE_ENV === 'production' ? '/api/getEB/' + ticId : 'http://localhost:3001/api/getEB/' + ticId;

  try {
    const response = await fetch(url);

    if (response.status !== 200) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function submitEBResponse(ticId: string, ebResponse: any) {
  const url = process.env.NODE_ENV === 'production' ? '/api/ebResponse/' : 'http://localhost:3001/api/ebResponse/';

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + (await auth.currentUser?.getIdToken()),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        ticId,
        response: ebResponse,
      }),
    });

    return (await response.json()).success;
  } catch {
    return false;
  }
}
