import { useEffect, useState } from 'react';
import { getAllTics } from '../apiHandler';
import Link from './Link';
import TicDisposition from './TicDisposition';
import { TableRows, ViewAgenda, Search } from '@mui/icons-material';
import { exofopLink, searchTicList, sortTicList, TicBasicProperties, TicListSortByOptions } from '../utils';

export default function TicTable(props: { onError?: Function }) {
  const [ticData, setTicData] = useState([]);
  const [compact, setCompact] = useState(true);
  const [sortBy, setSortBy] = useState('ticId');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllTics().then((d) => {
      if (!d || !d.length) props.onError?.();
      else setTicData(d);
    });
  }, [props]);

  return (
    <>
      <FloatingSearchBar value={search} onChange={setSearch} />
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
        <div className="sort-by">
          <label htmlFor="sortby">Sort by:</label>
          <select name="sortby" onChange={(e) => setSortBy(e.target.value)}>
            {TicListSortByOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
        {compact ? (
          <TicTableCompact ticData={sortTicList(searchTicList(ticData, search), sortBy)} sortBy={sortBy} />
        ) : (
          sortTicList(searchTicList(ticData, search), sortBy).map((tic: any) => (
            <TicTableRow ticData={tic} sortBy={sortBy} key={tic.ticId} />
          ))
        )}
      </div>
    </>
  );
}

function TicTableCompact(props: { ticData: any; sortBy: string }) {
  return (
    <table className="table-compact" cellSpacing={0}>
      <thead>
        <tr>
          <th className={`${props.sortBy === 'ticId' ? 'sort' : ''}`}>TIC ID</th>
          <th>Exofop</th>
          <th>Sectors</th>
          <th className={`${props.sortBy === 'epoch' ? 'sort' : ''}`}>Epoch [BJD]</th>
          <th className={`${props.sortBy === 'period' ? 'sort' : ''}`}>Period [Days]</th>
          <th>Duration [Hrs]</th>
          <th>Depth [ppm]</th>
          <th>Depth [%]</th>
          <th className={`${props.sortBy === 'rTranister' ? 'sort' : ''}`}>RTransiter</th>
          <th className={`${props.sortBy === 'rStar' ? 'sort' : ''}`}>RStar</th>
          <th>Tmag</th>
          <th>Δ Tmag</th>
          <th className={`${props.sortBy === 'paperDisp' ? 'sort' : ''}`}>Paper Disp</th>
          <th className={`${props.sortBy === 'dispAsc' || props.sortBy === 'dispDesc' ? 'sort' : ''}`}># Disps</th>
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
      <td className="tic-id mono">
        <Link href={`/tic/${props.ticData.ticId}`}>{props.ticData.ticId}</Link>
      </td>
      <td>
        <Link href={exofopLink(props.ticData.ticId)}>Exofop</Link>
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

function TicTableRow(props: { ticData: any; sortBy: string }) {
  return (
    <div className="row">
      <div className="header">
        <a className="tic-id" href={`/tic/${props.ticData.ticId}`}>
          TIC {props.ticData.ticId}
        </a>
        <Link href={exofopLink(props.ticData.ticId)}>Exofop</Link>
      </div>
      <div className="data-wrapper">
        {TicBasicProperties.filter((p) => p.id !== 'ticId').map((p) => {
          return (
            !!props.ticData[p.id] && (
              <div className={`data mono ${props.sortBy === p.id ? 'sort' : ''}`}>
                <div className="name">{p.name}</div>
                <div className="value">{p.id === 'sectors' ? props.ticData[p.id].replaceAll(',', ', ') : props.ticData[p.id]}</div>
              </div>
            )
          );
        })}
        <div className="flex-br" style={{ width: '100%' }}></div>
        {props.ticData.dispositions['user:paper'] && (
          <TicDisposition data={{ ...props.ticData.dispositions['user:paper'], name: 'Paper Disposition' }} />
        )}
        <div className="num-dispositions">{Object.keys(props.ticData.dispositions).length} Dispositions</div>
      </div>
    </div>
  );
}

function FloatingSearchBar(props: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="floating-search">
      <div className="label">{<Search />} Search</div>
      <input type="text" placeholder="1003831, pVshape" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
    </div>
  );
}
