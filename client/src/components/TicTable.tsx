import { useEffect, useState } from 'react';
import { getAllTics } from '../apiHandler';
import Link from './Link';
import TicDisposition from './TicDisposition';
import { TableRows, ViewAgenda } from '@mui/icons-material';
import { exofopLink } from '../utils';

export default function TicTable(props: { onError?: Function }) {
  const [ticData, setTicData] = useState([]);
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    getAllTics().then((d) => {
      if (!d || !d.length) props.onError?.();
      else setTicData(d);
    });
  }, [props]);

  return (
    <div className="tic-table">
      <div className="title">
        TIC Table
        <div className="style-toggle">
          <div className={`icon ${compact ? 'active' : ''}`} onClick={() => setCompact(true)}>
            <TableRows fontSize="large" />
          </div>
          <div className={`icon ${compact ? '' : 'active'}`} onClick={() => setCompact(false)}>
            <ViewAgenda fontSize="large" />
          </div>
        </div>
      </div>
      {compact ? <TicTableCompact ticData={ticData} /> : ticData.map((tic: any) => <TicTableRow ticData={tic} key={tic.ticId} />)}
    </div>
  );
}

function TicTableCompact(props: { ticData: any }) {
  return (
    <table className="table-compact">
      <thead>
        <tr>
          <th>TIC Id</th>
          <th>Exofop</th>
          <th>Sectors</th>
          <th>Epoch [BJD]</th>
          <th>Period [Days]</th>
          <th>Duration [Hrs]</th>
          <th>Depth [ppm]</th>
          <th>Depth [%]</th>
          <th>RTransiter</th>
          <th>RStar</th>
          <th>Tmag</th>
          <th>Δ Tmag</th>
          <th>Paper Disp</th>
          <th># Disps</th>
        </tr>
      </thead>
      <tbody>
        {props.ticData.map((t: any) => (
          <TicTableCompactRow ticData={t} key={t.ticId} />
        ))}
      </tbody>
    </table>
  );
}

function TicTableCompactRow(props: { ticData: any }) {
  return (
    <tr>
      <td className="tic-id mono"><Link href={`/tic/${props.ticData.ticId}`}>{props.ticData.ticId}</Link></td>
      <td>
        <Link href={exofopLink(props.ticData.ticId)}>
          Exofop
        </Link>
      </td>
      <td>{props.ticData.sectors.replaceAll(',', ', ')}</td>
      <td className="mono">{props.ticData.epoch}</td>
      <td className="mono">{props.ticData.period}</td>
      <td className="mono">{props.ticData.duration}</td>
      <td className="mono">{props.ticData.depth}</td>
      <td className="mono">{props.ticData.depthPercent}</td>
      <td className="mono">{props.ticData.rTranister /* Spelled wrong lol*/}</td>
      <td className="mono">{props.ticData.rStar}</td>
      <td className="mono">{props.ticData.tmag}</td>
      <td className="mono">{props.ticData.deltaTmag}</td>
      <td>{props.ticData.dispositions['user:paper']?.disposition}</td>
      <td className="mono">{Object.keys(props.ticData.dispositions).length}</td>
    </tr>
  );
}

function TicTableRow(props: { ticData: any }) {
  return (
    <div className="row">
      <div className="header">
        <a className="tic-id" href={`/tic/${props.ticData.ticId}`}>TIC {props.ticData.ticId}</a>
        <Link href={exofopLink(props.ticData.ticId)}>Exofop</Link>
      </div>
      <div className="data-wrapper">
        {!!props.ticData.sectors && (
          <div className="data mono">
            <div className="name">Sectors</div>
            <div className="value">{props.ticData.sectors.replaceAll(',', ', ')}</div>
          </div>
        )}
        {!!props.ticData.epoch && (
          <div className="data mono">
            <div className="name">Epoch [BJD]</div>
            <div className="value">{props.ticData.epoch}</div>
          </div>
        )}
        {!!props.ticData.period && (
          <div className="data mono">
            <div className="name">Period [Days]</div>
            <div className="value">{props.ticData.period}</div>
          </div>
        )}
        {!!props.ticData.duration && (
          <div className="data mono">
            <div className="name">Duration [Hours]</div>
            <div className="value">{props.ticData.duration}</div>
          </div>
        )}
        {!!props.ticData.depth && (
          <div className="data mono">
            <div className="name">Depth [ppm]</div>
            <div className="value">{props.ticData.depth}</div>
          </div>
        )}
        {!!props.ticData.depthPercent && (
          <div className="data mono">
            <div className="name">Depth [%]</div>
            <div className="value">{props.ticData.depthPercent}</div>
          </div>
        )}
        {!!props.ticData.rTranister && (
          <div className="data mono">
            <div className="name">RTransiter</div>
            <div className="value">{props.ticData.rTranister}</div> {/* rTransiter is spelled wrong in the data */}
          </div>
        )}
        {!!props.ticData.rStar && (
          <div className="data mono">
            <div className="name">RStar</div>
            <div className="value">{props.ticData.rStar}</div>
          </div>
        )}
        {!!props.ticData.tmag && (
          <div className="data mono">
            <div className="name">Tmag</div>
            <div className="value">{props.ticData.tmag}</div>
          </div>
        )}
        {!!props.ticData.deltaTmag && (
          <div className="data mono">
            <div className="name">Delta Tmag</div>
            <div className="value">{props.ticData.deltaTmag}</div>
          </div>
        )}
        <div className="flex-br" style={{ width: '100%' }}></div>
        {props.ticData.dispositions['user:paper'] && (
          <TicDisposition data={{ ...props.ticData.dispositions['user:paper'], name: 'Paper Disposition' }} />
        )}
        <div className="num-dispositions">{Object.keys(props.ticData.dispositions).length} Dispositions</div>
      </div>
    </div>
  );
}
