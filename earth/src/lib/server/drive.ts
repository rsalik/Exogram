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
  getFiles("tic_files", id, MimeTypes.PDF);

export const getEBFiles = async (group: string) =>
  getFiles("eb_" + group, undefined, MimeTypes.IMAGE);

export const getDuplicateEBFiles = async () =>
  getFiles("duplicate_ebs", undefined, MimeTypes.IMAGE);

export const getEBFile = async (
  group: string,
  id: string,
  allowDone = false
) => {
  const folderNames = ["eb_" + group];

  if (allowDone) folderNames.push("eb_" + group + "_done");

  return (
    await getFiles(folderNames, ebIDToFileNamePartial(id), MimeTypes.IMAGE)
  )[0];
};

export const getDoneEBFiles = async (group: string) =>
  getFiles(`eb_${group}_done`, undefined, MimeTypes.IMAGE);

export async function getFiles(
  folders: string[] | string,
  partialName?: string,
  mimeTypes?: MimeTypes | MimeTypes[],
  nextPageToken?: string
) {
  const drive = getDrive();

  const allFolderIds = await getFolders();

  if (!Array.isArray(folders)) folders = [folders];

  const folderIds = folders.map((folder) => {
    const id = allFolderIds[folder];
    if (id) return id;

    throw new Error(`Folder ID for '${folder}' not found.`);
  });

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

  console.log("Querying Drive:", folderString, mimeTypeString, nameString, nextPageToken)

  const response = await drive.files.list({
    q: [folderString, mimeTypeString, nameString].filter(Boolean).join(" and "),
    pageSize: 1000,
    fields:
      "nextPageToken, files(id, name, mimeType, webViewLink, webContentLink, parents)",
    pageToken: nextPageToken,
  });

  let files = response.data.files || [];

  if (response.data.nextPageToken) {
    const nextPageFiles = await getFiles(
      folders,
      partialName,
      mimeTypes,
      response.data.nextPageToken
    );

    if (nextPageFiles) files = [...files, ...nextPageFiles];
  }

  return files;
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
