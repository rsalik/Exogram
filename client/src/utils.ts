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
    name: 'RTransiter',
    value: 'rTranister', // Spelled wrong ofc
  },
  {
    name: 'RStar',
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
    shortName: 'Epoch [BJD]',
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
    name: 'Depth [ppm]',
    id: 'depth',
    shortName: 'Depth [ppm]',
  },
  {
    name: 'Depth [%]',
    id: 'depthPercent',
    shortName: 'Depth [%]',
  },
  {
    name: 'RTransiter',
    id: 'rTranister', // Spelled wrong ofc
    shortName: 'RTransiter',
  },
  {
    name: 'RStar',
    id: 'rStar',
    shortName: 'RStar',
  },
  {
    name: 'Tmag',
    id: 'tmag',
    shortName: 'Tmag',
  },
  {
    name: 'Delta Tmag',
    id: 'deltaTmag',
    shortName: 'Δ Tmag',
  },
];

export function sortTicList(ticList: any[], sortBy: string) {
  if (sortBy === 'dispDesc') {
    return ticList.sort((a, b) => {
      if (Object.keys(a.dispositions).length < Object.keys(b.dispositions).length) {
        return 1;
      }
      if (Object.keys(a.dispositions).length > Object.keys(b.dispositions).length) {
        return -1;
      }
      return 0;
    });
  }

  if (sortBy === 'dispAsc') {
    return ticList.sort((a, b) => {
      if (Object.keys(a.dispositions).length < Object.keys(b.dispositions).length) {
        return -1;
      }
      if (Object.keys(a.dispositions).length > Object.keys(b.dispositions).length) {
        return 1;
      }
      return 0;
    });
  }

  if (sortBy === 'paperDisp') {
    return ticList.sort((a, b) => {
      let aD = a.dispositions['user:paper']?.disposition;
      let bD = b.dispositions['user:paper']?.disposition;

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

export function searchTicList(ticList: any[], search: string) {
  search = search.toLowerCase();

  return ticList.filter((tic) => {
    return !search
      .split(',')
      .map((t) => t.trim())
      .map((s) => {
        if (tic.ticId.startsWith(s)) return true;

        if (
          Object.keys(tic.dispositions).some((d) => {
            if (tic.dispositions[d].disposition.toLowerCase().includes(s)) return true;
            if (tic.dispositions[d].comments.toLowerCase().includes(s)) return true;
            return false;
          })
        )
          return true;

        return false;
      })
      .includes(false);
  });
}
