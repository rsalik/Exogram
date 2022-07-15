import { getTicChartData } from './chartDataHandler';
import { getChartOptions } from './defaultOptions';

export class ChartDataGenerator {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;

  tics: string[];

  colorArr = ['#61dafb', '#fb61bd', '#ffe345'];

  constructor(tics: string[], title: string, xAxisLabel: string, yAxisLabel: string) {
    this.tics = tics.sort();
    this.title = title;
    this.xAxisLabel = xAxisLabel;
    this.yAxisLabel = yAxisLabel;
  }

  async generateData() {
    let data = {
      datasets: [] as any[],
    };

    for (const ticId of this.tics) {
      data.datasets.push(this.generateDataset(await getTicChartData(ticId), ticId));
    }

    return data;
  }

  generateDataset(ticData: any, ticId: string) {
    throw new Error('Method not implemented.');
  }

  generateOptions() {
    return getChartOptions(this.title, this.xAxisLabel, this.yAxisLabel);
  }

  getColorOfTic(ticId: string) {
    return this.colorArr[this.tics.indexOf(ticId) % this.colorArr.length];
  }
}
