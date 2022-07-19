import { Help } from '@mui/icons-material';
import Chart from './Chart';
import { useState } from 'react';
import LinkedChartController from '../charts/LinkedChartController';
import { TicChartType } from '../charts/ChartDataGenerator';

export function TicChartsPanel(props: { ticId: string }) {
  const [showHelp, setShowHelp] = useState(false);

  const [linkedChartController, setLinkedChartController] = useState<LinkedChartController | undefined>(new LinkedChartController());

  return (
    <div className="tic-charts-panel">
      <div className="title-sec">
        <div className="title">
          Charts
          <div className={`show-help ${showHelp ? 'active' : ''}`} onClick={() => setShowHelp(true)}>
            <Help fontSize="large" />
          </div>
        </div>
        <div className="settings">
          <div className="link-graphs">
            Link Graphs&nbsp;
            <div
              className={`btn ${!!linkedChartController ? 'active' : ''}`}
              onClick={() => {
                if (!linkedChartController) setLinkedChartController(new LinkedChartController());
              }}
            >
              On
            </div>
            <div className="sep">/</div>
            <div
              className={`btn ${!linkedChartController ? 'active' : ''}`}
              onClick={() => {
                setLinkedChartController(undefined);
              }}
            >
              Off
            </div>
          </div>
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
            <div className="title">Chart Help</div>
            <div className="row">
              <strong>Click + Drag</strong>: Pan
            </div>
            <div className="row">
              <strong>
                <span className="key">Alt</span> + Scroll
              </strong>
              : Zoom
            </div>
            <div className="row md">
              <span></span>&nbsp;&nbsp;denotes a Momentum Dump.
            </div>
            <div className="row resize">
              Charts can be resized by dragging the icon near the bottom right corner of the chart up or down.
            </div>
            <div className="close">Click anywhere to close.</div>
          </div>
        </div>
      )}
      <Chart type={TicChartType.NORMALIZED_FLUX} tics={[props.ticId]} linkController={linkedChartController} />
      <Chart type={TicChartType.CENTROID_OFFSET} tics={[props.ticId]} linkController={linkedChartController} />
      <Chart type={TicChartType.BACKGROUND_FLUX} tics={[props.ticId]} linkController={linkedChartController} />
    </div>
  );
}
