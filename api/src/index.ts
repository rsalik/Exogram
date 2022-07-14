import { google } from 'googleapis';
import { getTicFilesFromFolder, recursiveGetSubfolders } from './googleDriveHandler';

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

  let files = [] as any[];
  const folderList = (await recursiveGetSubfolders('1Z74BU-ijJy710QA3M9YwE_l1cE_dpSHA', drive)) as any[];

  for await (const folder of folderList) {
    const newFiles = await getTicFilesFromFolder(req.params.ticId.toString(), drive, folder.id);
    if (newFiles) files = files.concat(newFiles);
  }

  res.send(
    files.map((f) => ({
      ...f,
      webContentLink: f.webContentLink.replace(/&export=download/g, ''),
    }))
  );
});

export default app;

if (process.env.NODE_ENV !== 'production') app.listen(process.env.PORT || 3001, () => console.log("Listening..."));
