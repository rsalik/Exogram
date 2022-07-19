import { getTicChartData } from './chartDataHandler';

export const MOMENTUM_DUMP_WIDTH = 0.6;

export default async function generateMomentumDumpBands(tics: string[]) {
  let index = 0;
  let annotations = {} as { [key: string]: any };

  let momentumDumps = [] as any[];

  for (const ticId of tics) {
    const data = await getTicChartData(ticId);

    if (data && data.time) {
      for (let i = 0; i < data.time.length; i++) {
        if (data.momentum_dumps[i]) {
          annotations[`band${index++}`] = {
            type: 'box',
            xMin: data.time[i] - MOMENTUM_DUMP_WIDTH / 2,
            xMax: data.time[i] + MOMENTUM_DUMP_WIDTH / 2,
            backgroundColor: '#fb4a6199',
            borderColor: '#00000000',
            adjustScaleRange: false,
            drawTime: 'beforeDraw',
          };

          momentumDumps.push({
            tic: ticId,
            time: data.time[i],
          });
        }
      }
    }
  }

  return {
    annotations,
    momentumDumps,
  };
}
