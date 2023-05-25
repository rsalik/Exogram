import { getAllTicDispositions, getAllUsernames, getEBResponses, getUsername } from './handlers/databaseHandler';

export function exofopLink(ticId: string) {
  return `https://exofop.ipac.caltech.edu/tess/target.php?id=${ticId}`;
}

export function latteLink(ticId: string) {
  return `http://latte-online.flatironinstitute.org/app#ID=${ticId}`;
}

export const TicListSortByOptions = [
  {
    name: 'TIC ID',
    value: 'ticId',
  },
  {
    name: 'Period [Days]',
    value: 'period',
  },
  {
    name: 'Planet Radius',
    value: 'rPlanet',
  },
  {
    name: 'Star Radius',
    value: 'rStar',
  },
  {
    name: '# Dispositions Ascending',
    value: 'dispAsc',
  },
  {
    name: '# Dispositions Descending',
    value: 'dispDesc',
  },
  {
    name: 'Paper Disposition',
    value: 'paperDisp',
  },
];

export const TicBasicProperties = [
  {
    name: 'TIC ID',
    id: 'ticId',
    shortName: 'TIC ID',
  },
  {
    name: 'Sector(s)',
    id: 'sectors',
    shortName: 'Sector(s)',
  },
  {
    name: 'Period [Days]',
    id: 'period',
    shortName: 'Period [Days]',
  },
  {
    name: 'Duration [Hours]',
    id: 'duration',
    shortName: 'Duration [Hrs]',
  },
  {
    name: 'Depth [%]',
    id: 'depthPercent',
    shortName: 'Depth%',
  },
  {
    name: 'Planet Radius [R<sub>J</sub>]',
    id: 'rPlanet',
    shortName: 'R<sub>P</sub> [R<sub>J</sub>]',
  },
  {
    name: 'Star Radius [R<sub>☉</sub>]',
    id: 'rStar',
    shortName: 'R<sub>S</sub> [R<sub>☉</sub>]',
  },
  {
    name: 'TESSmag',
    id: 'tmag',
    shortName: 'Tmag',
  },
  {
    name: 'Delta TESSmag',
    id: 'deltaTmag',
    shortName: 'Δ Tmag',
  },
];

export function sortTicList(ticList: any[], sortBy: string) {
  if (sortBy === 'dispDesc') {
    return ticList.sort((a, b) => {
      return b.dispositionCount - a.dispositionCount;
    });
  }

  if (sortBy === 'dispAsc') {
    return ticList.sort((a, b) => {
      return a.dispositionCount - b.dispositionCount;
    });
  }

  if (sortBy === 'paperDisp') {
    return ticList.sort((a, b) => {
      let aD = a.paperDisposition?.disposition;
      let bD = b.paperDisposition?.disposition;

      if (aD && !bD) return -1;
      if (!aD && bD) return 1;

      if (aD && bD) {
        if (aD.toLowerCase() < bD.toLowerCase()) return -1;
        if (aD.toLowerCase() > bD.toLowerCase()) return 1;
        return 0;
      }

      return 0;
    });
  }

  if (sortBy === 'ticId') {
    return ticList.sort((a, b) => {
      let aI = parseFloat(a.ticId.replaceAll('(', '.').replaceAll(')', ''));
      let bI = parseFloat(b.ticId.replaceAll('(', '.').replaceAll(')', ''));

      if (aI < bI) return -1;
      if (aI > bI) return 1;
      return 0;
    });
  }

  return ticList.sort((a, b) => {
    if (!a[sortBy] && !b[sortBy]) return 0;
    if (!a[sortBy]) return 1;
    if (!b[sortBy]) return -1;

    const af = parseFloat(a[sortBy]);
    const bf = parseFloat(b[sortBy]);

    if (af < bf) {
      return -1;
    }
    if (af > bf) {
      return 1;
    }
    return 0;
  });
}

export function searchTicList(ticList: any[], search: string, dispositions: any) {
  search = search.toLowerCase();

  return ticList.filter((tic) => {
    return !search
      .split(',')
      .map((t) => t.trim())
      .map((s) => {
        if (tic.ticId.startsWith(s)) return true;

        if (!dispositions || !dispositions[tic.ticId]) return false;

        if (
          Object.keys(dispositions[tic.ticId]).some((d) => {
            if (dispositions[tic.ticId][d].disposition.toLowerCase().includes(s)) return true;
            if (dispositions[tic.ticId][d].comments.toLowerCase().includes(s)) return true;
            return false;
          })
        )
          return true;

        return false;
      })
      .includes(false);
  });
}

export function downloadFile(content: string, mimeType: string, filename: string) {
  var a = document.createElement('a');
  var blob = new Blob([content], { type: mimeType });
  var url = URL.createObjectURL(blob);
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
}

export async function downloadTics(ticList: any[], name: string) {
  const dispositionsArr = await getAllTicDispositions(ticList);

  const userCols = [] as string[];
  const lines = [] as string[];

  ticList.forEach((tic) => {
    const line = [] as string[];

    TicBasicProperties.forEach((p) => {
      line.push(tic[p.id]);
    });

    line.push(tic.paperDisposition?.disposition ?? '');
    line.push(tic.paperDisposition?.comments ?? '');

    const disps = dispositionsArr[tic.ticId];

    if (disps) {
      disps.forEach((disp: any) => {
        if (!userCols.includes(disp.userId)) userCols.push(disp.userId);
      });

      userCols.forEach((user) => {
        const disp = disps.find((d: any) => d.userId === user);

        if (disp) {
          line.push(disp.disposition);
          line.push(disp.comments);
        } else {
          line.push('');
          line.push('');
        }
      });
    }

    lines.push(line.map((l) => `"${l}"`).join(','));
  });

  const usernames = await getAllUsernames(userCols);
  usernames['group'] = 'Group';

  const header = [...TicBasicProperties.map((p) => p.name.replaceAll(/<\/?sub>/gm, '')), 'Paper Disposition', 'Paper Comments'];

  for (let uid of userCols) {
    header.push(usernames[uid] + ' Disposition');
    header.push(usernames[uid] + ' Comments');
  }

  downloadFile(header.join(',') + '\n' + lines.join('\n'), 'text/csv', name);
}

// Admin Only
export async function downloadEBs() {
  try {
    const ebs = await getEBResponses();

    if (!ebs) return;

    const header = ['TIC ID', '# Responses', '# is EB', '# is Period Correct'];
    const usernames = {} as { [key: string]: string };

    const getUserHeaders = (uid: string, username: string) => {
      const uid5 = uid.slice(0, 5);
      return [`${username} (${uid5}) is EB?`, `${username} (${uid5}) is Period Correct?`, `${username} (${uid5}) Comments`];
    };

    const lines = [] as string[];

    for (let eb in ebs) {
      const line = [eb, Object.keys(ebs[eb]).length];
      let isEbs = 0,
        isPeriodCorrects = 0;

      for (let uid in ebs[eb]) {
        if (!usernames[uid] || !header.includes(getUserHeaders(uid, usernames[uid])[0])) {
          usernames[uid] = await getUsername(uid);
          header.push(...getUserHeaders(uid, usernames[uid]));
        }

        if (ebs[eb][uid].isEB) isEbs++;
        if (ebs[eb][uid].isPeriodCorrect) isPeriodCorrects++;

        line[header.indexOf(getUserHeaders(uid, usernames[uid])[0])] = ebs[eb][uid].isEB;
        line[header.indexOf(getUserHeaders(uid, usernames[uid])[1])] = ebs[eb][uid].isPeriodCorrect;
        line[header.indexOf(getUserHeaders(uid, usernames[uid])[2])] = `"${ebs[eb][uid].comments}"`;
      }

      line[2] = isEbs;
      line[3] = isPeriodCorrects;

      lines.push(line.join(','));
    }

    downloadFile(header.join(',') + '\n' + lines.join('\n'), 'text/csv', `Exogram EBs ${new Date().toLocaleString()}.csv`);
  } catch {}
}
