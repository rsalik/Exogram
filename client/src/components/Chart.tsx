import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { ChartDataGenerator } from '../charts/ChartDataGenerator';
import { useState, useEffect } from 'react';

ChartJS.register(zoomPlugin, CrosshairPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Default Styling
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.family =
  "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export default function Chart(props: { generator: ChartDataGenerator }) {
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  const [tooltipData, setTooltipData] = useState<any>(null);

  function onTooltipUpdate(ctx: any) {
    console.log(ctx);
    setTooltipData({ text: ctx.tooltip.body[0].lines[0] });
  }

  useEffect(() => {
    props.generator.generateData().then(setData);

    let options = props.generator.generateOptions();
    options.plugins.tooltip.external = onTooltipUpdate;
    setOptions(options);
  }, [props.generator]);

  if (!data || !options) return null;

  return (
    <div className="chart" onMouseLeave={() => setTooltipData(null)}>
      <Scatter data={data} options={options} />
      {tooltipData && (
        <div className="tooltip">
          <div className="text">{tooltipData.text}</div>
        </div>
      )}
    </div>
  );
}
