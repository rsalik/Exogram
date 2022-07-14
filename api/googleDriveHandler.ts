import { drive_v3 } from 'googleapis';

export async function recursiveGetSubfolders(folderId: string, drive: drive_v3.Drive, pageToken?: string) {
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

export function getTicFilesFromFolder(ticId: string, drive: drive_v3.Drive, folderId = '1Z74BU-ijJy710QA3M9YwE_l1cE_dpSHA') {
  return new Promise((resolve, reject) => {
    drive.files.list(
      {
        q: `'${folderId}' in parents and name contains '${ticId}' and mimeType != 'application/vnd.google-apps.folder'`,
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
