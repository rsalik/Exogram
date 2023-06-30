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

  const tics = await getEBFileNames(drive);

  if (!tics || !tics.length) {
    res.status(200).send({ none: true });
    return;
  }

  let randomTic;

  let snapshot: any = null;

  do {
    if (!tics.length) {
      res.status(200).send({ none: true });
      return;
    }

    randomTic = tics[Math.floor(Math.random() * tics.length)];

    // Remove the file from the array
    tics.splice(tics.indexOf(randomTic), 1);

    const ref = db.ref(`ebs/${randomTic}/${uid}`);
    snapshot = await ref.once('value');
  } while (snapshot && snapshot.exists());

  const doneFiles = (await getDoneEBFileNames(drive)) || [];

  res.send({ file: await getEBFile(drive, randomTic), progress: doneFiles.length / (tics.length + doneFiles.length) });
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

        const activeRef = db.ref(`ebs_active`);
        const doneRef = db.ref(`ebs_done`);

        const activeSnapshot = await activeRef.once('value');
        const doneSnapshot = await doneRef.once('value');

        const active = activeSnapshot.val().split(',') || [];
        const done = doneSnapshot.val().split(',') || [];

        activeRef.set(active.filter((a: string) => a !== ticId).join(','));
        doneRef.set([...done, ticId].join(','));
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

async function getEBFileNames(drive: drive_v3.Drive): Promise<string[] | null> {
  return getCachedEBFileNamesOrCreateCache(drive, getEBFiles, 'ebs_active');
}

async function getDoneEBFileNames(drive: drive_v3.Drive): Promise<string[] | null> {
  return getCachedEBFileNamesOrCreateCache(drive, getDoneEBFiles, 'ebs_done');
}

async function getCachedEBFileNamesOrCreateCache(
  drive: drive_v3.Drive,
  getFunction: (drive: drive_v3.Drive) => Promise<drive_v3.Schema$File[] | null>,
  refName: string
) {
  const ref = db.ref(refName);

  const snapshot = await ref.once('value');
  if (!snapshot.exists()) {
    return await updateEBFileCache(drive, getFunction, refName);
  }

  const timestamp_ref = db.ref(refName + '_timestamp');
  const timestamp = await timestamp_ref.once('value');

  if (!timestamp.exists() || Date.now() - timestamp.val() > 12 * 60 * 60 * 1000 /* 12 hours */) {
    return await updateEBFileCache(drive, getFunction, refName);
  }

  const val = snapshot.val();
  if (val === "") return [];
  return val.split(',');
}

async function updateEBFileCache(
  drive: drive_v3.Drive,
  getFunction: (drive: drive_v3.Drive) => Promise<drive_v3.Schema$File[] | null>,
  refName: string
) {
  const names = (await getFunction(drive))?.map((file) => parseInt(file.name?.split('.')[0].replace('TIC', '') || '-1').toString());

  const ref = db.ref(refName);
  ref.set(names?.join(','));

  const timestamp_ref = db.ref(refName + '_timestamp');
  timestamp_ref.set(Date.now());

  return names;
}

function getEBFiles(drive: drive_v3.Drive): Promise<drive_v3.Schema$File[] | null> {
  return new Promise((resolve, reject) => {
    let nextPageToken: string | undefined = undefined;
    let files: drive_v3.Schema$File[] = [];

    async function getFiles() {
      drive.files.list(
        {
          q: `'13yIRMekWCvwckG5nfvCpS7OJ_vsMa0Td' in parents and mimeType = 'image/jpeg'`,
          pageSize: 1000,
          fields: 'nextPageToken, files(id, webContentLink, name, mimeType)',
          pageToken: nextPageToken,
        },
        async (err: any, driveRes: any) => {
          if (err) reject(console.error(err));

          nextPageToken = driveRes.data.nextPageToken;
          files = [...files, ...driveRes.data.files];

          if (nextPageToken) {
            getFiles();
          } else {
            resolve(files);
          }
        }
      );
    }

    getFiles();
  });
}

function getDoneEBFiles(drive: drive_v3.Drive): Promise<drive_v3.Schema$File[] | null> {
  return new Promise((resolve, reject) => {
    let nextPageToken: string | undefined = undefined;
    let files: drive_v3.Schema$File[] = [];

    async function getFiles() {
      drive.files.list(
        {
          q: `'1iC_W_YwIlUzZU6CC2aFg_qYiGRAWZp4n' in parents and mimeType = 'image/jpeg'`,
          pageSize: 1000,
          fields: 'nextPageToken, files(id, webContentLink, name, mimeType)',
          pageToken: nextPageToken,
        },
        async (err: any, driveRes: any) => {
          if (err) reject(console.error(err));

          nextPageToken = driveRes.data.nextPageToken;
          files = [...files, ...driveRes.data.files];

          if (nextPageToken) {
            getFiles();
          } else {
            resolve(files);
          }
        }
      );
    }

    getFiles();
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
