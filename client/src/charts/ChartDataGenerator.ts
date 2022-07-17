import { getTicChartData } from './chartDataHandler';
import { getChartOptions } from './defaultOptions';

export class ChartDataGenerator {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;

  tics: string[];

  hasCleanData = false;

  colorArr = ['#61dafb', '#fb61bd', '#ffe345'];

  constructor(tics: string[], title: string, xAxisLabel: string, yAxisLabel: string) {
    this.tics = tics.sort();
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

  getDefaultRange() {
    return {
      min: 0,
      max: 10,
    };
  }
}
