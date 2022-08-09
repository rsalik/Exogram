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

async function recursiveGetSubfolders(folderId: string, drive: drive_v3.Drive, pageToken?: string) {
  return new Promise((resolve, reject) => {
    let folderIds: any[] = [];

    drive.files.list(
      {
        q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
        pageSize: 1000,
        fields: 'nextPageToken, files(id, webContentLink, name, mimeType)',
        pageToken: pageToken,
      },
      async (err: any, driveRes: any) => {
        if (err) {
          console.error('The API returned an error: ' + err);
          reject(err);
        }

        if (driveRes.data.nextPageToken) {
          folderIds = folderIds.concat(await recursiveGetSubfolders(folderId, driveRes.data.nextPageToken));
        }

        for await (const file of driveRes.data.files) {
          // Skip TIC-specific folders
          /*if (file.name.match(/^\d+$/)) {
            continue;
          }*/

          folderIds = folderIds.concat(await recursiveGetSubfolders(file.id, drive));
        }

        folderIds = folderIds.concat(driveRes.data.files);
        resolve(folderIds);
      }
    );
  });
}

function getTicFilesFromFolder(ticId: string, drive: drive_v3.Drive, folderId = '1Z74BU-ijJy710QA3M9YwE_l1cE_dpSHA') {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'${folderId}' in parents and name contains '${ticId}' and mimeType == 'application/pdf'`,
        pageSize: 1000,
        fields: 'nextPageToken, files(id, webContentLink, name, mimeType)',
      },
      async (err: any, driveRes: any) => {
        if (err) reject(console.error(err));

        let files = driveRes.data.files;

        if (driveRes.data.nextPageToken) {
          files = files.concat(await getTicFilesFromFolder(ticId, drive, folderId));
        }

        resolve(files);
      }
    );
  });
}

module.exports = app;

if (process.env.NODE_ENV !== 'production') app.listen(process.env.PORT || 3001, () => console.log('Listening...'));
