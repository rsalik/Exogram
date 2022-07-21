import { Chart } from 'chart.js';

export function getChartOptions(title = 'Default Title', xAxisLabel = 'X Axis', yAxisLabel = 'Y Axis') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    // animations: false,
    interaction: {
      intersect: false,
      mode: 'nearestPerDataset',
      axis: 'x'
    },
    onHover: (event: any, active: any) => {},
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 18,
          },
        },
        grid: {
          color: '#fff2',
          borderColor: '#fffa',
        },
        min: 0.99,
        max: 1.01,
      },
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          font: {
            size: 18,
          },
        },
        grid: {
          color: '#fff2',
          borderColor: '#fffa',
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          onPanComplete: (state: { chart: Chart }) => {},
          modifierKey: 'shift',
        },
        zoom: {
          wheel: {
            enabled: true,
            modifierKey: 'alt',
          },
          pinch: {
            enabled: true,
            modifierKey: 'alt',
          },
          drag: {
            enabled: true,
            modifierKey: 'alt',
          },
          mode: 'xy',
          onZoomComplete: (state: { chart: Chart }) => {},
        },
      },
      annotation: {
        annotations: {} as {
          [key: string]: {
            type: string;
            xMin: number;
            xMax: number;
            yMin?: number;
            yMax?: number;
            backgroundColor: string;
            borderColor: string;
          };
        },
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 25,
        },
        text: title,
      },
      crosshair: {
        line: {
          color: '#fffc', // crosshair line color
          width: 1, // crosshair line width
        },
        sync: {
          enabled: true, // enable trace line syncing with other charts
          group: 1, // chart group
          suppressTooltips: false, // suppress tooltips when showing a synced tracer
        },
        zoom: {
          enabled: false, // enable zooming
        },
      },
      tooltip: {
        enabled: false,
        external: (ctx: any) => {},
      },
    },
  };
}
