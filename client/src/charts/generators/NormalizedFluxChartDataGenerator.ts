import { ChartDataGenerator } from '../ChartDataGenerator';

export class NormalizedFluxChartDataGenerator extends ChartDataGenerator {
  hasCleanData = true;

  constructor(tics: any[]) {
    super(tics, 'Normalized Flux vs. Time', 'Time', 'Normalized Flux');
  }

  generateDataset(data: any, ticId: string, index: number, cleaned?: boolean) {
    console.log(data);
    if (!data || data.error) return null;

    return [{
      label: cleaned ? `TIC ${ticId} (clean)` : 'TIC ' + ticId,
      data: data.time.map((v: any, i: number) => {
        return cleaned
          ? {
              x: v,
              y: data.flux_clean[i] || null,
            }
          : {
              x: v,
              y: data.flux[i] || null,
            };
      }),
      showLine: true,
      borderColor: this.getColorOfTic(ticId),
      backgroundColor: this.getColorOfTic(ticId),
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 2,
    }];
  }

  getDefaultRange() {
    return {
      min: 0.99,
      max: 1.01,
    };
  }
}
