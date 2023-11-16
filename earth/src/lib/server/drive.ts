import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from "$env/static/private";
import { getFolders } from "$lib/admin/firebase/firebase";
import { google } from "googleapis";
import { ebIDToFileNamePartial } from "$lib/util";

export function getDrive() {
  const auth = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY.replace(/\\n/gm, "\n"),
    ["https://www.googleapis.com/auth/drive"]
  );

  return google.drive({ version: "v3", auth });
}

export const getTicFiles = async (id: string) =>
  getFiles("tic_files", false, MimeTypes.PDF, id);

export const getEBFiles = async (group: string) =>
  getFiles("eb_" + group, false, MimeTypes.IMAGE);

export const getDuplicateEBFiles = async () =>
  getFiles("duplicate_ebs", false, MimeTypes.IMAGE);

export const getEBFile = async (
  group: string,
  id: string,
  allowDone = false
) => {
  const folderNames = ["eb_" + group];

  if (allowDone) folderNames.push("eb_" + group + "_done");

  return (
    await getFiles(
      folderNames,
      false,
      MimeTypes.IMAGE,
      ebIDToFileNamePartial(id)
    )
  )[0];
};

export const getDoneEBFiles = async (group: string) =>
  getFiles(`eb_${group}_done`, false, MimeTypes.IMAGE, undefined);

export async function getFiles(
  folders: string[] | string,
  recursiveFolders?: boolean,
  mimeTypes?: MimeTypes | MimeTypes[],
  partialName?: string
) {
  const allFolderIds = await getFolders();

  if (!Array.isArray(folders)) folders = [folders];

  const folderIds = folders.map((folder) => {
    const id = allFolderIds[folder];
    if (id) return id;

    throw new Error(`Folder ID for '${folder}' not found.`);
  });

  if (recursiveFolders)
    folderIds.push(...(await recursiveGetSubfolders(folderIds)));

  return await getFilesByFolderIDs(folderIds, mimeTypes, partialName);
}

async function getFilesByFolderIDs(
  folderIds: string[] | string,
  mimeTypes?: MimeTypes | MimeTypes[],
  partialName?: string,
  nextPageToken?: string
) {
  const drive = getDrive();

  if (!Array.isArray(folderIds)) folderIds = [folderIds];

  const folderString =
    "(" + folderIds.map((id) => `'${id}' in parents`).join(" or ") + ")";

  let mimeTypeString = "";

  if (mimeTypes) {
    if (!Array.isArray(mimeTypes)) mimeTypes = [mimeTypes];

    mimeTypeString =
      "(" +
      mimeTypes.map((mimeType) => `mimeType = '${mimeType}'`).join(" or ") +
      ")";
  }

  let nameString = "";

  if (partialName) {
    nameString = `name contains '${partialName}'`;
  }

  const response = await drive.files.list({
    q: [folderString, mimeTypeString, nameString].filter(Boolean).join(" and "),
    pageSize: 1000,
    fields:
      "nextPageToken, files(id, name, mimeType, webViewLink, webContentLink, parents)",
    pageToken: nextPageToken,
  });

  let files = response.data.files || [];

  if (response.data.nextPageToken) {
    const nextPageFiles = await getFilesByFolderIDs(
      folderIds,
      mimeTypes,
      partialName,
      response.data.nextPageToken
    );

    if (nextPageFiles) files = [...files, ...nextPageFiles];
  }

  return files;
}

async function recursiveGetSubfolders(folderIds: string[]) {
  const subfolders = (await getFilesByFolderIDs(folderIds, MimeTypes.FOLDER))
    .map((f) => f.id)
    .filter(Boolean) as string[];

  // Split subfolders into chunks of 20
  const subfolderChunks = subfolders.reduce((acc, cur, i) => {
    if (i % 20 === 0) acc.push([]);
    acc[acc.length - 1].push(cur);
    return acc;
  }, [] as string[][]);

  for (const chunk of subfolderChunks) {
    subfolders.push(...(await recursiveGetSubfolders(chunk)));
  }

  return subfolders;
}

export async function flattenFolder(folder: string) {
  console.log("Flattening folder:", folder);

  const drive = getDrive();

  const folderId = (await getFolders())[folder];
  const subfolders = await recursiveGetSubfolders([folderId]);

  // Split subfolders into chunks of 20
  const subfolderChunks = subfolders.reduce((acc, cur, i) => {
    if (i % 20 === 0) acc.push([]);
    acc[acc.length - 1].push(cur);
    return acc;
  }, [] as string[][]);

  const files = (
    await Promise.all(
      subfolderChunks.map((chunk) => getFilesByFolderIDs(chunk))
    )
  )
    .flat()

  for (const file of files) {
    if (!file.parents) continue;
    if (!file.id) continue;

    await drive.files.update({
      fileId: file.id,
      addParents: folderId,
      removeParents: file.parents.join(",")
    });
  }
}

export enum MimeTypes {
  FOLDER = "application/vnd.google-apps.folder",
  PDF = "application/pdf",
  IMAGE = "image/jpeg",
}

export async function markEBFileAsDuplicate(fileId: string) {
  const drive = getDrive();

  const file = await drive.files.get({
    fileId: fileId,
    fields: "parents",
  });

  // Set parents to 1APqI0syKB7h0CQWcfqRBxk5p_ANm95zS
  await drive.files.update({
    fileId: fileId,
    addParents: "1APqI0syKB7h0CQWcfqRBxk5p_ANm95zS",
    removeParents: file.data.parents?.join(","),
  });
}

export async function markEBFileAsDone(group: string, id: string) {
  const drive = getDrive();

  const file = await getEBFile(group, id, false);

  if (!file.id || !file.parents) return false;

  const folders = await getFolders();

  await drive.files.update({
    fileId: file.id,
    addParents: folders[`eb_${group}_done`],
    removeParents: file.parents.join(","),
  });

  return true;
}
