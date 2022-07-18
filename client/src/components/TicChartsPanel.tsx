import { BackgroundFluxChartDataGenerator } from '../charts/generators/BackgroundFluxChartDataGenerator';
import { CentroidOffsetChartDataGenerator } from '../charts/generators/CentroidOffsetChartDataGenerator';
import { NormalizedFluxChartDataGenerator } from '../charts/generators/NormalizedFluxChartDataGenerator';
import { Help } from '@mui/icons-material';
import Chart from './Chart';
import { useState } from 'react';

export function TicChartsPanel(props: { ticId: string }) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="tic-charts-panel">
      <div className="title">
        Charts
        <div className={`show-help ${showHelp ? 'active' : ''}`} onClick={() => setShowHelp(true)}>
          <Help fontSize="large" />
        </div>
      </div>
      {showHelp && (
        <div
          className="help-wrapper"
          onClick={() => {
            setShowHelp(false);
          }}
        >
          <div className="help">
            <div className="title">Chart Instructions</div>
            <div className="row">
              <strong>Click + Drag</strong>: Pan
            </div>
            <div className="row">
              <strong>
                <span className="key">Alt</span> + Scroll
              </strong>
              : Zoom
            </div>
            <div className="row resize">Charts can be resized by dragging the icon near the bottom right corner of the chart up or down.</div>
            <div className="close">Click anywhere to close.</div>
          </div>
        </div>
      )}
      <Chart generator={new NormalizedFluxChartDataGenerator([props.ticId])} />
      <Chart generator={new CentroidOffsetChartDataGenerator([props.ticId])} />
      <Chart generator={new BackgroundFluxChartDataGenerator([props.ticId])} />
    </div>
  );
}
