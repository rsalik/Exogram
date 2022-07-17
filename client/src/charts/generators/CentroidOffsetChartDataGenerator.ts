import { ChartDataGenerator } from '../ChartDataGenerator';

export class CentroidOffsetChartDataGenerator extends ChartDataGenerator {
  constructor(tics: any[]) {
    super(tics, 'Centroid Offset vs. Time', 'Time', 'Centroid Offset');
  }

  generateDataset(data: any, ticId: string, index: number, cleaned?: boolean) {
    if (!data || data.error) return null;

    return [
      {
        label: `TIC ${ticId} COM X`,
        data: data.time.map((v: any, i: number) => {
          return {
            x: v,
            y: data.com_x[i] || null,
          };
        }),
        showLine: true,
        borderColor: this.colorArr[index % this.colorArr.length],
        backgroundColor: this.colorArr[index % this.colorArr.length],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 1,
      },
      {
        label: `TIC ${ticId} COM Y`,
        data: data.time.map((v: any, i: number) => {
          return {
            x: v,
            y: data.com_y[i] || null,
          };
        }),
        showLine: true,
        borderColor: this.colorArr[index +1 % this.colorArr.length],
        backgroundColor: this.colorArr[index + 1 % this.colorArr.length],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 1,
      },
    ];
  }

  getDefaultRange() {
    return {
      min: 0.999,
      max: 1.001,
    };
  }
}
