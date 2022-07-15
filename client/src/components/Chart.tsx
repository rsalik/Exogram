import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Interaction, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair';
import { ChartDataGenerator } from '../charts/ChartDataGenerator';
import { useState, useEffect } from 'react';

ChartJS.register(zoomPlugin, CrosshairPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// @ts-ignore
Interaction.modes.interpolate = Interpolate;
// Default Styling
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.family =
  "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

export default function Chart(props: { generator: ChartDataGenerator }) {
  const [data, setData] = useState<any>(null);
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    props.generator.generateData().then(setData);
    setOptions(props.generator.generateOptions());
  }, [props.generator]);

  if (!data || !options) return null;

  return (
    <div className="chart">
      <Scatter data={data} options={options} />
    </div>
  );
}
