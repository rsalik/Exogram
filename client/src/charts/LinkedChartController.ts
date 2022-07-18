import { Chart } from 'chart.js';

interface ChartObj {
  index: number;
  callback: (min: number, max: number) => void;
}

export default class LinkedChartController {
  charts: ChartObj[] = [];
  index = 0;

  createListenerFunction() {
    return (state: { chart: Chart }) => {
      const { chart } = state;

      this.updateCharts(chart.scales.x.min, chart.scales.x.max);
    };
  }

  addChart(callback: (min: number, max: number) => void) {
    this.charts.push({ index: this.index++, callback });

    return this.removeChart.bind(this, this.index - 1);
  }

  removeChart(index: number) {
    const i = this.charts.findIndex((c) => c.index === index);
    if (i > -1) {
      this.charts.splice(i, 1);
    }
  }

  zoomTo(obj: { min: number; max: number }) {
    this.updateCharts(obj.min, obj.max);
  }

  updateCharts(min: number, max: number) {
    this.charts.forEach((c) => c.callback(min, max));
  }
}
