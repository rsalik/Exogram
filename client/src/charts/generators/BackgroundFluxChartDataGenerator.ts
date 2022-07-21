import { ChartDataGenerator } from '../ChartDataGenerator';

export class BackgroundFluxChartDataGenerator extends ChartDataGenerator {
  constructor(tics: any[]) {
    super(tics, 'Background Flux vs. Time', 'Time', 'Background Flux');
  }

  generateDataset(data: any, ticId: string, index: number, cleaned?: boolean) {
    if (!data || data.error) return null;

    return [
      {
        label: `TIC ${ticId}`,
        data: data.time.map((v: any, i: number) => {
          return {
            x: v,
            y: data.sap_bkg[i] || null,
          };
        }),
        showLine: true,
        borderColor: this.colorArr[(index * 2) % this.colorArr.length],
        backgroundColor: this.colorArr[(index * 2) % this.colorArr.length],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 1,
      },
    ];
  }

  getDefaultRange() {
    return {
      min: -1500,
      max: 1500,
    };
  }
}
