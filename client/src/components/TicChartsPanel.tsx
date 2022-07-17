import { CentroidOffsetChartDataGenerator } from "../charts/generators/CentroidOffsetChartDataGenerator";
import { NormalizedFluxChartDataGenerator } from "../charts/generators/NormalizedFluxChartDataGenerator";
import Chart from "./Chart";

export function TicChartsPanel(props: { ticId: string }) {
  return (
    <div className="tic-charts-panel">
      <div className="title">Charts</div>
      <Chart generator={new NormalizedFluxChartDataGenerator([props.ticId])} />
      <Chart generator={new CentroidOffsetChartDataGenerator([props.ticId])} />
    </div>
  );
}
