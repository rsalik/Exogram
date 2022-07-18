import { Chart } from 'chart.js';

export function getChartOptions(title: string, xAxisLabel: string, yAxisLabel: string) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
          mode: 'x',
          onZoomComplete: (state: { chart: Chart }) => {},
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
        mode: 'index',
        intersect: false,
        enabled: false,
        external: (ctx: any) => {},
      },
    },
  };
}
