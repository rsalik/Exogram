import { TicChartType } from './ChartDataGenerator';
import { BackgroundFluxChartDataGenerator } from './generators/BackgroundFluxChartDataGenerator';
import { CentroidOffsetChartDataGenerator } from './generators/CentroidOffsetChartDataGenerator';
import { NormalizedFluxChartDataGenerator } from './generators/NormalizedFluxChartDataGenerator';

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

export function createGenerator(type: TicChartType, tics: string[]) {
  switch (type) {
    case TicChartType.NORMALIZED_FLUX:
      return new NormalizedFluxChartDataGenerator(tics);
    case TicChartType.CENTROID_OFFSET:
      return new CentroidOffsetChartDataGenerator(tics);
    case TicChartType.BACKGROUND_FLUX:
      return new BackgroundFluxChartDataGenerator(tics);
    default:
      throw new Error('Invalid chart type');
  }
}
