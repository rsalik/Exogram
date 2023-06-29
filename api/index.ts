import { drive_v3, google } from 'googleapis';

import express, { Request, Response, NextFunction } from 'express';

import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

import admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'exogram-46cc8',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  }),
  databaseURL: 'https://exogram-46cc8-default-rtdb.firebaseio.com',
});

const db = admin.database();

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  // CORS allow any
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
}

async function decodeIDToken(req: Request, _res: Response, next: NextFunction) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      (req as any).currentUser = decodedToken;
    } catch {}
  }

  next();
}

app.use(decodeIDToken);

app.get('/api/getTicFiles/:ticId', async (req, res) => {
  if (!req.params.ticId) {
    res.status(400).send('Missing ticId');
    return;
  }

  const auth = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'), [
    'https://www.googleapis.com/auth/drive',
  ]);

  const drive = google.drive({ version: 'v3', auth });

  const files = await getTicFiles(req.params.ticId, drive);

  if (!files || !files.length) {
    res.send([]);
    return;
  }

  res.send(
    files.map((f) => ({
      ...f,
      webContentLink: f.webContentLink?.replace(/&export=download/g, ''),
    }))
  );
});

app.get('/api/randomEB', async (req, res) => {
  const currentUser = (req as any).currentUser;

  if (!currentUser) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { uid } = currentUser;

  const auth = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'), [
    'https://www.googleapis.com/auth/drive',
  ]);

  const drive = google.drive({ version: 'v3', auth });

  const files = await getEBFiles(drive);

  if (!files) {
    res.status(500).send({ none: true });
    return;
  }

  if (!files.length) {
    res.status(200).send({ none: true });
    return;
  }

  let randomFile;

  let snapshot: any = null;

  do {
    randomFile = files[Math.floor(Math.random() * files.length)];

    // Remove the file from the array
    files.splice(files.indexOf(randomFile), 1);

    if (!randomFile) {
      res.status(200).send({ none: true });
      return;
    }

    const ref = db.ref(`ebs/${randomFile.name?.split('.')[0]}/${uid}`);
    snapshot = await ref.once('value');
  } while (snapshot && snapshot.exists());

  const doneFiles = (await getDoneEBFiles(drive)) || [];

  res.send({ file: randomFile, progress: doneFiles.length / (files.length + doneFiles.length) });
});

app.get('/api/getEB/:ticId', async (req, res) => {
  if (!req.params.ticId) {
    res.status(400).send('Missing ticId');
    return;
  }

  const ticId = req.params.ticId;

  const auth = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'), [
    'https://www.googleapis.com/auth/drive',
  ]);

  const drive = google.drive({ version: 'v3', auth });

  try {
    const file = await getEBFile(drive, ticId);

    if (!file) {
      res.status(200).send({ none: true });
      return;
    }

    res.send(file);
  } catch {
    res.status(500).send({ error: true });
  }
});

app.post('/api/ebResponse', async (req, res) => {
  const currentUser = (req as any).currentUser;

  if (!currentUser) {
    res.status(401).send({ success: false });
    return;
  }

  const { uid } = currentUser;

  const { ticId, response } = req.body;

  if (!ticId || !response) {
    res.status(400).send({ success: false });
    return;
  }

  const ref = db.ref(`ebs/${ticId}/${uid}`);

  try {
    await ref.set(response);

    res.send({ success: true });

    const snapshot = await db.ref(`ebs/${ticId}`).once('value');

    if (snapshot.numChildren() >= 3) {
      try {
        const auth = new google.auth.JWT(
          process.env.GOOGLE_CLIENT_EMAIL,
          undefined,
          process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
          ['https://www.googleapis.com/auth/drive']
        );

        const drive = google.drive({ version: 'v3', auth });

        const file = await getEBFile(drive, ticId, true);

        if (!file || !file.id) {
          console.error(`Could not find the file for the TIC ${ticId} after all the responses were submitted.`);
          return;
        }

        drive.files.update({
          fileId: file.id,
          addParents: '1iC_W_YwIlUzZU6CC2aFg_qYiGRAWZp4n',
          removeParents: file.parents?.join(','),
          fields: 'id, name, parents',
        });
      } catch (e) {
        console.error(`An error occurred while marking ${ticId} to the Done folder:`);
        console.error(e);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false });
  }
});

function getTicFiles(ticId: string, drive: drive_v3.Drive): Promise<drive_v3.Schema$File[] | null> {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'1h_9ylFGZwaWkovcxBYTduTtgo6DPuqtN' in parents and name contains '${ticId}' and mimeType = 'application/pdf'`,
        pageSize: 1000,
        fields: 'files(id, webContentLink, name, mimeType)',
      },
      async (err: any, driveRes: any) => {
        if (err) reject(console.error(err));

        let files = driveRes.data.files;
        resolve(files);
      }
    );
  });
}

function getEBFiles(drive: drive_v3.Drive): Promise<drive_v3.Schema$File[] | null> {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'13yIRMekWCvwckG5nfvCpS7OJ_vsMa0Td' in parents and mimeType = 'image/jpeg'`,
        pageSize: 1000,
        fields: 'files(id, webContentLink, name, mimeType)',
      },
      async (err: any, driveRes: any) => {
        if (err) reject(console.error(err));

        let files = driveRes.data.files;
        resolve(files);
      }
    );
  });
}

function getDoneEBFiles(drive: drive_v3.Drive): Promise<drive_v3.Schema$File[] | null> {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'1iC_W_YwIlUzZU6CC2aFg_qYiGRAWZp4n' in parents and mimeType = 'image/jpeg'`,
        pageSize: 1000,
        fields: 'files(id, webContentLink, name, mimeType)',
      },
      async (err: any, driveRes: any) => {
        if (err) reject(console.error(err));

        let files = driveRes.data.files;
        resolve(files);
      }
    );
  });
}

function getEBFile(drive: drive_v3.Drive, ticId: string, parents?: boolean): Promise<drive_v3.Schema$File | null> {
  // ticId must have leading zeros so that it is 16 characters long
  ticId = ticId.padStart(16, '0');

  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `('13yIRMekWCvwckG5nfvCpS7OJ_vsMa0Td' in parents or '1iC_W_YwIlUzZU6CC2aFg_qYiGRAWZp4n' in parents) and mimeType = 'image/jpeg' and name = 'TIC${ticId}.jpg'`,
        pageSize: 1000,
        fields: `files(id, webContentLink, name, mimeType${parents ? ', parents' : ''})`,
      },
      async (err: any, driveRes: any) => {
        if (err) reject(console.error(err));

        let files = driveRes.data.files;
        resolve(files[0]);
      }
    );
  });
}

module.exports = app;

if (process.env.NODE_ENV !== 'production') app.listen(process.env.PORT || 3001, () => console.log('Listening...'));
