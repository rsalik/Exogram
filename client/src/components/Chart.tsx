import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { ChartDataGenerator } from '../charts/ChartDataGenerator';
import { useState, useEffect, useRef } from 'react';
import LinkedChartController from '../charts/LinkedChartController';

ChartJS.register(zoomPlugin, CrosshairPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Default Styling
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.family =
  "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export default function Chart(props: { generator: ChartDataGenerator; linkController?: LinkedChartController }) {
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  const [tooltipData, setTooltipData] = useState<any>(null);
  const [clean, setClean] = useState(false);

  const [defaultXAxisBounds, setDefaultXAxisBounds] = useState<any>({ min: 0, max: 0 });

  const chart = useRef<any>(null);

  function onTooltipUpdate(ctx: any) {
    setTooltipData({ points: ctx.tooltip.dataPoints });
  }

  useEffect(() => {
    props.generator.generateData(clean).then(setData);
  }, [props.generator, clean]);

  useEffect(() => {
    let options = props.generator.generateOptions();
    options.plugins.tooltip.external = onTooltipUpdate;
    options.scales.y.max = props.generator.getDefaultRange().max;
    options.scales.y.min = props.generator.getDefaultRange().min;

    props.generator.getDefaultXAxisBounds().then(setDefaultXAxisBounds);

    let removeChartFunction: () => void;

    if (props.linkController) {
      removeChartFunction = props.linkController.addChart((min, max) => {
        setOptions({
          ...options,
          scales: {
            ...options.scales,
            x: {
              ...options.scales.x,
              max,
              min,
            },
          },
        });
      });
      let func = props.linkController.createListenerFunction();

      options.plugins.zoom.zoom.onZoomComplete = func;
      options.plugins.zoom.pan.onPanComplete = func;
    }

    setOptions(options);

    return () => {
      if (removeChartFunction) removeChartFunction();
    };
  }, [props.generator, props.linkController]);

  if (!data || !options) return null;

  return (
    <div className="chart" onMouseLeave={() => setTooltipData(null)}>
      <Scatter data={data} options={options} ref={chart} />
      {tooltipData && (
        <div className="tooltip">
          {tooltipData.points[0]?.raw.x && (
            <div className="text">
              Time: <span className="mono">{tooltipData.points[0].raw.x.toFixed(4)}</span>
            </div>
          )}
          {tooltipData.points.map((p: any, i: number) => (
            <div className="text color" key={i} style={{ backgroundColor: p.dataset.backgroundColor }}>
              {p.dataset.label}: <span className="mono">{p.raw.y.toFixed(6)}</span>
            </div>
          ))}
        </div>
      )}
      <div
        className="btn"
        onClick={() => {
          if (props.linkController) props.linkController.zoomTo(defaultXAxisBounds);
          else chart.current?.resetZoom();
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
