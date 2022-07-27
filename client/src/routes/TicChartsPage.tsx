import { Backspace, ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { TicChartsPanel } from '../components/TicChartsPanel';

export default function TicChartsPage() {
  const [ticIds, setTicIds] = useState([] as string[]);
  const [ticTrackInput, setTicTrackInput] = useState('');

  function addInputtedTic() {
    if (!ticTrackInput || !ticTrackInput.length) return;
    setTicTrackInput('');

    if (ticIds.includes(ticTrackInput)) return;
    if (!ticTrackInput.match(/^\d+$/)) return;

    setTicIds([...ticIds, ticTrackInput]);
  }

  return (
    <div className="charts-page">
      <div className="title">TIC Charts</div>
      <div className="track">
        <div className="input-wrapper">
          <input
            type="text"
            value={ticTrackInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addInputtedTic();
            }}
            onChange={(e) => setTicTrackInput(e.target.value.replaceAll(/\D/gm, ''))}
            placeholder="Track a TIC"
          />
          <div className="btn go" onClick={addInputtedTic}>
            {<ChevronRight fontSize="large" />}
          </div>
        </div>
        {!!ticIds.length && (
          <div className="tracked">
            <div className="title">Tracked TICs</div>
            {ticIds.sort().map((ticId) => (
              <div
                className="tic"
                key={ticId}
                onClick={() => {
                  setTicIds(ticIds.filter((i) => i !== ticId));
                }}
              >
                TIC&nbsp;<span className="mono">{ticId}&nbsp;</span>
                <Backspace />
              </div>
            ))}
          </div>
        )}
      </div>
      <TicChartsPanel tics={ticIds} />
    </div>
  );
}