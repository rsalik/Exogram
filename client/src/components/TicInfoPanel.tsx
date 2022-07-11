import { exofopLink } from '../utils';
import TicDispositionTable from './TicDispositionTable';

export default function TicInfoPanel(props: { ticData: any }) {
  return (
    <div className="tic-info">
      <div className="title-sec-wrapper">
        <div className="title-sec">
          <div className="title">
            TIC <span>{props.ticData.ticId}</span>
          </div>
          <a href={exofopLink(props.ticData.ticId)} className="exofop-link">
            Exofop Link
          </a>
          {!!props.ticData.dispositions.filter((d: any) => d.userId === 'user:paper').length && (
            <div className="published-badge">This TIC was published in a Planet Patrol Paper</div>
          )}
        </div>
      </div>

      <div className="data-wrapper">
        <div className="data">
          <div className="name">Sectors</div>
          <div className="value">{props.ticData.sectors.replaceAll(',', ', ')}</div>
        </div>
        <div className="data">
          <div className="name">
            Epoch <span className="unit">[BJD]</span>
          </div>
          <div className="value">{props.ticData.epoch}</div>
        </div>
        <div className="data">
          <div className="name">
            Period <span className="unit">[Days]</span>
          </div>
          <div className="value">{props.ticData.period}</div>
        </div>
        <div className="data">
          <div className="name">
            Duration <span className="unit">[Hours]</span>
          </div>
          <div className="value">{props.ticData.duration}</div>
        </div>
        <div className="data">
          <div className="name">
            Depth <span className="unit">[ppm]</span>
          </div>
          <div className="value">{props.ticData.depth}</div>
        </div>
        <div className="data">
          <div className="name">
            Depth <span className="unit">[%]</span>
          </div>
          <div className="value">{props.ticData.depthPercent}</div>
        </div>
        <div className="data">
          <div className="name">RTransiter</div>
          <div className="value">{props.ticData.rTranister}</div>
        </div>
        <div className="data">
          <div className="name">RStar</div>
          <div className="value">{props.ticData.rStar}</div>
        </div>
        <div className="data">
          <div className="name">Tmag</div>
          <div className="value">{props.ticData.tmag}</div>
        </div>
        <div className="data">
          <div className="name">Delta Tmag</div>
          <div className="value">{props.ticData.deltaTmag}</div>
        </div>
      </div>
      <div className="dispositions">
        <div className="title">Dispositions</div>
        <TicDispositionTable data={props.ticData.dispositions} />
      </div>
    </div>
  );
}
