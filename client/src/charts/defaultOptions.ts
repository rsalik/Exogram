export function getChartOptions(title: string, xAxisLabel: string, yAxisLabel: string) {
  return {
    responsive: true,
    interaction: {
      mode: 'index',
      intersection: false,
    },
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
          modifierKey: 'alt',
        },
        zoom: {
          drag: {
            enabled: true,
          },
          mode: 'xy',
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
        mode: 'interpolate',
        intersect: false,
      },
    },
  };
}
