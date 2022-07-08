import { db } from './dbHandler';
import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
  scopes
);
const drive = google.drive({ version: 'v3', auth });

// Mostly just old code from Planet Patrol Website

export async function submitDispositionRequest(req: any, res: any) {
  if (req.user) {
    const { disposition, comments, group } = req.body;

    if (!disposition) {
      res.status(400);
      res.json({ message: 'Malformed request.' });
      return;
    }

    try {
      let fileId = 'tic:' + req.params.ticId;
      let file = await db.get(fileId);

      let key = req.session.userId;

      if (group) {
        if (req.user.group) key = 'user:group';
        else {
          res.status(403);
          res.json({ message: 'You do not have permission to submit as group.' });
        }
      }

      if (file.dispositions) file.dispositions[key] = { disposition: disposition, comments: comments };
      else {
        let dispositions: { [key: string]: any } = {};
        dispositions[key] = { disposition: disposition, comments: comments };
        file.dispositions = dispositions;
      }

      db.insert(file);
      res.status(200);
      res.json({ message: 'Success' });
    } catch (e) {
      res.status(400);
      res.json({ message: 'The request TIC could not be found.' });
    }
  } else {
    res.status(401);
    res.json({ message: 'You are not signed in.' });
  }
}

export function generateCSVRequest(req: any, res: any) {
  if (!ticList) {
    res.status(500);
    res.json({ message: 'An error occurred.' });
    return;
  }

  let all = req.url.includes('all');

  let csv =
    'TIC ID,ExoFOP-TESS,Sectors,Epoch [BJD],Period [Days],Duration [Hours],Depth [ppm],Depth [%],Rtranister [RJup],Rstar [RSun],Tmag,Delta Tmag,Paper disp (LC),Paper comm\n';

  ticList.forEach((tic: any) => {
    if (!all && !tic.doc.dispositions['user:paper']) return;

    let ticId = tic.id.split(':')[1];

    let newLine = [
      ticId,
      `https://exofop.ipac.caltech.edu/tess/target.php?id=${ticId.replace(/\([\s\S]*?\)/g, '')}`,
      `"${tic.doc.sectors}"`,
      `"${tic.doc.epoch}"`,
      `"${tic.doc.period}"`,
      `"${tic.doc.duration}"`,
      `"${tic.doc.depth}"`,
      `"${tic.doc.depthPercent}"`,
      `"${tic.doc.rTranister}"`,
      `"${tic.doc.rStar}"`,
      `"${tic.doc.tmag}"`,
      `"${tic.doc.deltaTmag}"`,
      `"${tic.doc.dispositions['user:paper'] ? tic.doc.dispositions['user:paper'].disposition : ''}"`,
      `"${tic.doc.dispositions['user:paper'] ? tic.doc.dispositions['user:paper'].comments : ''}"`,
    ].join(',');
    csv += newLine + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=planet-patrol-dispositions${all ? '-all' : ''}.csv`);
  res.status(200);
  res.send(csv);
}

export async function getTicDataRequest(req: any, res: any) {
  const tic = ticList.filter((t) => t.ticId === req.params.ticId)[0];

  if (!tic) {
    res.status(404);
    res.json({ message: 'The request TIC could not be found.' });
    return;
  }

  try {
    let dispositionsRealName: {}[] = [];

    await asyncForEach(Object.keys(tic.dispositions), async (key: string) => {
      let name = '';
      try {
        const nameDoc = await db.get(key);
        name = nameDoc.name;
      } catch {
        return;
      }

      dispositionsRealName.push({
        disposition: tic.dispositions[key].disposition,
        comments: tic.dispositions[key].comments,
        name: name,
        userId: key,
      });
    });

    res.json({ ...tic, dispositions: dispositionsRealName });
    res.status(200);
  } catch {
    res.status(500);
    res.json({ message: 'Something went wrong.' });
  }
}

export async function getTicFilesRequest(req: any, res: any) {
  const files = await getTicFiles(req.params.ticId);
  console.log(files);

  if (files.length) {
    res.json(files);
    res.status(200);
  } else {
    res.json({ message: 'No files found. ' });
    res.status(404);
  }
}

export async function getUserAnsweredTicsRequest(req: any, res: any) {
  if (req.user) {
    let unansweredTics = [] as any[];
    let answeredTics = [] as any[];

    if (!ticList) {
      res.status(500);
      res.json({ message: 'An error occurred.' });
      return;
    }

    for (let tic of ticList) {
      let id = tic.id.split(':')[1];
      if (tic.doc.dispositions && tic.doc.dispositions[req.session.userId])
        answeredTics.push({ id, length: Object.keys(tic.doc.dispositions).length });
      else unansweredTics.push({ id, length: Object.keys(tic.doc.dispositions).length });
    }

    res.json({ unanswered: unansweredTics, answered: answeredTics });
    res.status(200);
  } else {
    res.status(401);
    res.json({ message: 'You are not signed in.' });
  }
}

async function recursiveGetSubfolders(folderId: string, pageToken?: string) {
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

          folderIds = folderIds.concat(await recursiveGetSubfolders(file.id));
        }

        folderIds = folderIds.concat(driveRes.data.files);
        resolve(folderIds);
      }
    );
  });
}

export function getTicFilesFromFolder(ticId: string, folderId: string) {
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
          files = files.concat(await getTicFilesFromFolder(ticId, folderId));
        }

        resolve(files);
      }
    );
  });
}

export let ticList = [] as any[];
export let folderList = [] as any[];

export async function fetchFolderList() {
  folderList = (await recursiveGetSubfolders('1Z74BU-ijJy710QA3M9YwE_l1cE_dpSHA')) as any[];
}

export async function fetchTicList() {
  let newTicList: any[] = [];
  let pList: any = {};

  do {
    try {
      let startKey = newTicList[newTicList.length - 1]?.id || null;

      // @ts-ignore Doesn't want to accept { include_docs: true }, but it must lol
      if (startKey) pList = await db.partitionedList('tic', { include_docs: true, start_key: `${startKey}\0` });
      // @ts-ignore
      else pList = await db.partitionedList('tic', { include_docs: true });

      newTicList = newTicList.concat(pList.rows);
    } catch (e) {
      console.error(e);
      console.log('An Error occurred. Retrying in 10 seconds.');
      setTimeout(() => fetchTicList(), 10000);

      return;
    }
  } while (newTicList.length < pList.total_rows);

  ticList = newTicList
    .map((t) => t.doc)
    .map((t) => {
      return { ...t, ticId: t._id.replaceAll('tic:', ''), _rev: undefined, _id: undefined };
    });
}

async function getTicFiles(ticId: string) {
  let files = [] as any[];

  for await (let folder of folderList) {
    let newFiles = await getTicFilesFromFolder(ticId, folder.id);
    if (newFiles) files = files.concat(newFiles);
  }

  return files;
}

async function asyncForEach(array: any[], callback: Function) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
