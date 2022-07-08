import { useEffect, useState } from 'react';
import { getAllTics } from '../apiHandler';
import Link from './Link';
import TicDisposition from './TicDisposition';

export default function TicTable(props: { onError?: Function }) {
  const [ticData, setTicData] = useState([]);

  useEffect(() => {
    getAllTics().then((d) => {
      if (!d || !d.length) props.onError?.();
      else setTicData(d);
    });
  }, [props]);

  return (
    <div className="tic-table">
      <div className="title">TIC Table</div>
      {ticData.map((tic: any) => (
        <TicTableRow ticData={tic} key={tic.ticId} />
      ))}
    </div>
  );
}

function TicTableRow(props: { ticData: any }) {
  return (
    <a className="row" href={`/tic/${props.ticData.ticId}`}>
      <div className="ticId">
        <div>TIC {props.ticData.ticId}</div>
        <Link href={`https://exofop.ipac.caltech.edu/tess/target.php?id=${props.ticData.ticId}`}>Exofop</Link>
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
    </a>
  );
}
