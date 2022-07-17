import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { ChartDataGenerator } from '../charts/ChartDataGenerator';
import { useState, useEffect, useRef } from 'react';

ChartJS.register(zoomPlugin, CrosshairPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Default Styling
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.family =
  "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export default function Chart(props: { generator: ChartDataGenerator }) {
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  const [tooltipData, setTooltipData] = useState<any>(null);
  const [clean, setClean] = useState(false);

  const chartRef = useRef<any>();

  function onTooltipUpdate(ctx: any) {
    console.log(ctx);
    setTooltipData({ points: ctx.tooltip.dataPoints });
  }

  useEffect(() => {
    props.generator.generateData(clean).then(setData);

    let options = props.generator.generateOptions();
    options.plugins.tooltip.external = onTooltipUpdate;
    options.scales.y.max = props.generator.getDefaultRange().max;
    options.scales.y.min = props.generator.getDefaultRange().min;

    setOptions(options);
  }, [props.generator, clean]);

  if (!data || !options) return null;

  return (
    <div className="chart" onMouseLeave={() => setTooltipData(null)}>
      <Scatter data={data} options={options} ref={chartRef} />
      {tooltipData && (
        <div className="tooltip">
          {tooltipData.points[0]?.raw.x && (
            <div className="text">
              Time: <span className="mono">{tooltipData.points[0].raw.x.toFixed(3)}</span>
            </div>
          )}
          {tooltipData.points.map((p: any) => (
            <div className="text color" style={{ backgroundColor: p.dataset.backgroundColor }}>
              {p.dataset.label}: <span className="mono">{p.raw.y.toFixed(4)}</span>
            </div>
          ))}
        </div>
      )}
      <div
        className="btn"
        onClick={() => {
          chartRef.current?.resetZoom();
        }}
      >
        Reset Zoom
      </div>
      {props.generator.hasCleanData && (
        <div className="btn show-clean" onClick={() => setClean(!clean)}>
          {clean ? 'Show Raw' : 'Show Cleaned'}
        </div>
      )}
    </div>
  );
}
