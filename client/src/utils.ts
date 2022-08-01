export function exofopLink(ticId: string) {
  return `https://exofop.ipac.caltech.edu/tess/target.php?id=${ticId}`;
}

export const TicListSortByOptions = [
  {
    name: 'TIC ID',
    value: 'ticId',
  },
  {
    name: 'Epoch [BJD]',
    value: 'epoch',
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
    name: 'Sectors',
    id: 'sectors',
    shortName: 'Sectors',
  },
  {
    name: 'Epoch [BJD]',
    id: 'epoch',
    shortName: 'Epoch',
  },
  {
    name: 'Period [Days]',
    id: 'period',
    shortName: 'Period',
  },
  {
    name: 'Duration [Hours]',
    id: 'duration',
    shortName: 'Duration',
  },
  {
    name: 'Depth [ppm]',
    id: 'depth',
    shortName: 'Depth',
  },
  {
    name: 'Depth [%]',
    id: 'depthPercent',
    shortName: 'Depth%',
  },
  {
    name: 'Planet Radius [R<sub>J</sub>]',
    id: 'rPlanet',
    shortName: 'R<sub>P</sub>',
  },
  {
    name: 'Star Radius [R<sub>☉</sub>]',
    id: 'rStar',
    shortName: 'R<sub>S</sub>',
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

    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    if (a[sortBy] > b[sortBy]) {
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

        if (!dispositions[tic.ticId]) return false;

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
