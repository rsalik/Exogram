import { ChartDataGenerator } from '../ChartDataGenerator';

export class NormalizedFluxChartDataGenerator extends ChartDataGenerator {
  hasCleanData = true;

  constructor(tics: any[]) {
    super(tics, 'Normalized Flux vs. Time', 'Time', 'Normalized Flux');
  }

  generateDataset(data: any, ticId: string, index: number, cleaned?: boolean) {
    if (!data || data.error) return null;

    return [
      {
        label: cleaned ? `TIC ${ticId} (clean)` : 'TIC ' + ticId,
        data: cleaned
          ? data.time_clean.map((v: any, i: number) => {
              return { x: v, y: data.flux_clean[i] || null };
            })
          : data.time.map((v: any, i: number) => {
              return { x: v, y: data.flux[i] || null };
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
      min: 0.97,
      max: 1.03,
    };
  }
}
