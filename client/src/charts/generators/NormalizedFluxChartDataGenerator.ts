import { ChartDataGenerator } from '../ChartDataGenerator';

export class NormalizedFluxChartDataGenerator extends ChartDataGenerator {
  constructor(tics: any[]) {
    super(tics, 'Normalized Flux vs. Time', 'Time', 'Normalized Flux');
  }

  generateDataset(data: any, ticId: string) {
    console.log(data);
    if (!data || data.error) return null;

    return {
      label: 'TIC ' + ticId,
      data: data.time.map((v: any, i: number) => {
        return {
          x: v,
          y: data.flux[i] || null,
        };
      }),
      showLine: true,
      borderColor: this.getColorOfTic(ticId),
      backgroundColor: this.getColorOfTic(ticId),
    };
  }
}
