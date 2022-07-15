let savedData: { [key: string]: any } = {};

export async function getTicChartData(ticId: string) {
  if (savedData[ticId]) {
    return savedData[ticId];
  }

  const data = await fetchTicChartData(ticId);
  savedData[ticId] = data;
  return data;
}

async function fetchTicChartData(ticId: string) {
  const res = await fetch(`https://circumbinary.pythonanywhere.com/tic/${ticId}`);
  const data = await res.text();
  return JSON.parse(data.replaceAll('NaN', 'null'));
}
