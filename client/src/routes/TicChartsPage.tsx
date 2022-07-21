import { useState } from "react";
import { TicChartsPanel } from "../components/TicChartsPanel";

export default function TicChartsPage() {
  const [ticIds, setTicIds] = useState(['122695048', '204698337']);

  return <div className="charts-page">
    <div className="title">
      TIC Charts
    </div>
    <TicChartsPanel tics={ticIds} />
  </div>
}