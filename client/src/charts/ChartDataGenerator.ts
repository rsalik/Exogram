import { getTicChartData } from './chartDataHandler';
import { getChartOptions } from './defaultOptions';
import generateMomentumDumpBands from './MomentumDumpAnnotationGenerator';

export enum TicChartType {
  NORMALIZED_FLUX,
  CENTROID_OFFSET,
  BACKGROUND_FLUX,
}

export class ChartDataGenerator {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;

  tics: string[];

  hasCleanData = false;

  colorArr = ['#61dafb', '#ffe345', '#fb61bd', '#8afb61', '#fb9261', '#9261fb'];

  constructor(tics: string[], title: string, xAxisLabel: string, yAxisLabel: string) {
    this.tics = tics.map((t) => t.replaceAll(/\(.+\)/gm, '')).sort(); // Remove parenthesis from TIC names
    this.title = title;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
  }

  async generateData(cleaned?: boolean) {
    let data = {
      datasets: [] as any[],
    };

    let i = 0;
    for (const ticId of this.tics) {
      let newData = this.generateDataset(await getTicChartData(ticId), ticId, i, cleaned);
      if (newData) {
        data.datasets.push(...newData);
        i += newData.length;
      }
    }

    return data;
  }

  generateDataset(ticData: any, ticId: string, index: number, cleaned?: boolean): any[] | null {
    throw new Error('Method not implemented.');
  }

  generateOptions() {
    return getChartOptions(this.title, this.xAxisLabel, this.yAxisLabel);
  }

  async getMomentumDumps() {
    return await generateMomentumDumpBands(this.tics);
  }

  getDefaultRange() {
    return {
      min: 0,
      max: 10,
    };
  }

  async getDefaultXAxisBounds() {
    let min = -1;
    let max = 0;

    for (const ticId of this.tics) {
      let data = await getTicChartData(ticId);
      if (data && data.time) {
        if (min === -1) min = data.time[0] - 50;
        else min = Math.min(min, data.time[0] - 50);

        if (max === 0) max = data.time[data.time.length - 1] + 50;
        else max = Math.max(max, data.time[data.time.length - 1] + 50);
      }
    }

    min = Math.floor(min / 10) * 10;
    max = Math.ceil(max / 10) * 10;

    return {
      min,
      max,
    };
  }
}