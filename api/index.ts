import { drive_v3, google } from 'googleapis';

import express from 'express';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

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

module.exports = app;

if (process.env.NODE_ENV !== 'production') app.listen(process.env.PORT || 3001, () => console.log('Listening...'));
