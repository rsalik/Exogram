import {
  getAllEBDispositions,
  getUsers,
} from "$lib/admin/firebase/firebase.js";
import { error } from "@sveltejs/kit";

export const GET = async ({ locals }) => {
  if (!locals.user?.admin) throw error(403, "Forbidden");

  const ebs = await getAllEBDispositions();

  if (!ebs) throw error(500, "Could not get EBs");

  const header = [
    "Group",
    "TIC ID",
    "# Responses",
    "# is EB",
    "# is Period Correct",
  ];

  const lines: string[] = [];

  const userHeaderLocs = {} as { [key: string]: number };
  const users = await getUsers();

  for (const group in ebs) {
    for (const eb in ebs[group]) {
      const line = [group, eb, Object.keys(ebs[group][eb]).length];
      let isEBs = 0;
      let isPeriodCorrects = 0;

      for (const uid in ebs[group][eb]) {
        if (!userHeaderLocs[uid]) {
          userHeaderLocs[uid] = header.length;

          const username = users.find((u) => u.id === uid)?.name;

          // Add Headers
          const uid5 = uid.slice(0, 5);
          header.push(
            `${username} (${uid5}) is EB?`,
            `${username} (${uid5}) is Period Correct?`,
            `${username} (${uid5}) Comments`
          );
        }

        const disposition = ebs[group][eb][uid];

        if (disposition.isEB) isEBs++;
        if (disposition.isPeriodCorrect) isPeriodCorrects++;

        line[userHeaderLocs[uid]] = disposition.isEB.toString();
        line[userHeaderLocs[uid] + 1] = disposition.isPeriodCorrect.toString();
        line[userHeaderLocs[uid] + 2] = `"${disposition.comments}"`;
      }

      line[3] = isEBs.toString();
      line[4] = isPeriodCorrects.toString();

      lines.push(line.join(","));
    }
  }

  const filename = `Exogram_Export_All_EBs_${new Date()
    .toLocaleString()
    .replace(/\/|,|:|\s/g, "_")}`;

  return new Response([header.join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}.csv`,
    },
  });
};

// export async function downloadEBs() {
//   try {
//     const ebs = await getEBResponses();

//     if (!ebs) return;

//     const header = ['TIC ID', '# Responses', '# is EB', '# is Period Correct'];
//     const usernames = {} as { [key: string]: string };

//     const getUserHeaders = (uid: string, username: string) => {
//       const uid5 = uid.slice(0, 5);
//       return [`${username} (${uid5}) is EB?`, `${username} (${uid5}) is Period Correct?`, `${username} (${uid5}) Comments`];
//     };

//     const lines = [] as string[];

//     for (let eb in ebs) {
//       const line = [eb, Object.keys(ebs[eb]).length];
//       let isEbs = 0,
//         isPeriodCorrects = 0;

//       for (let uid in ebs[eb]) {
//         if (!usernames[uid] || !header.includes(getUserHeaders(uid, usernames[uid])[0])) {
//           usernames[uid] = await getUsername(uid);
//           header.push(...getUserHeaders(uid, usernames[uid]));
//         }

//         if (ebs[eb][uid].isEB) isEbs++;
//         if (ebs[eb][uid].isPeriodCorrect) isPeriodCorrects++;

//         line[header.indexOf(getUserHeaders(uid, usernames[uid])[0])] = ebs[eb][uid].isEB;
//         line[header.indexOf(getUserHeaders(uid, usernames[uid])[1])] = ebs[eb][uid].isPeriodCorrect;
//         line[header.indexOf(getUserHeaders(uid, usernames[uid])[2])] = `"${ebs[eb][uid].comments}"`;
//       }

//       line[2] = isEbs;
//       line[3] = isPeriodCorrects;

//       lines.push(line.join(','));
//     }

//     downloadFile(header.join(',') + '\n' + lines.join('\n'), 'text/csv', `Exogram EBs ${new Date().toLocaleString()}.csv`);
//   } catch {}
// }
