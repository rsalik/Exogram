import { useEffect, useState } from 'react';
import Link from './Link';
import { Link as ReactLink, useParams } from 'react-router-dom';
import TicDisposition from './TicDisposition';
import { TableRows, ViewAgenda, Search } from '@mui/icons-material';
import { exofopLink, searchTicList, sortTicList, TicBasicProperties, TicListSortByOptions } from '../utils';
import { getAllTicDispositions, useTicGroups } from '../handlers/databaseHandler';
import ErrorPanel from './ErrorPanel';

export default function TicTable(props: { ticList: any[] }) {
  const ticList = props.ticList;
  const ticGroups = useTicGroups();

  const { group } = useParams();

  const [dispositions, setDispositions] = useState<any>({});

  const [compact, setCompact] = useState(true);
  const [activeGroup, setActiveGroup] = useState(group || '1000000');
  const [sortBy, setSortBy] = useState('ticId');
  const [search, setSearch] = useState('');
  const [publishedOnly, setPublishedOnly] = useState(false);

  useEffect(() => {
    getAllTicDispositions(ticList).then(setDispositions);
  }, [ticList]);

  useEffect(() => {
    if (activeGroup !== 'all' && isNaN(parseInt(activeGroup))) {
      setActiveGroup('1000000');
    }

    if (window.location.pathname.includes('table')) window.history.pushState({}, '', `/table/${activeGroup}`);
  }, [activeGroup]);

  function getFilteredTicList() {
    return sortTicList(searchTicList(publishedOnly ? ticList.filter((t: any) => !!t.paperDisposition) : ticList, search, dispositions), sortBy).filter(
      (t: any) => activeGroup === 'all' || t.group === parseInt(activeGroup)
    );
  }

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
        <div className="settings">
          <div className={`filter ${publishedOnly ? '' : 'active'}`} onClick={() => setPublishedOnly(false)}>
            All
          </div>
          <div className="sep">/</div>
          <div className={`filter ${publishedOnly ? 'active' : ''}`} onClick={() => setPublishedOnly(true)}>
            Published Only
          </div>
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes*/}
          <div className="sep">//</div>
          &nbsp;
          <div className="sort-by">
            <label htmlFor="sortby"> Sort by</label>
            <select name="sortby" onChange={(e) => setSortBy(e.target.value)}>
              {TicListSortByOptions.map((o) => (
                <option key={o.value} value={o.value.toString()}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          {/* eslint-disable-next-line react/jsx-no-comment-textnodes*/}
          <div className="sep">//</div>
          <div className="group">
            <label htmlFor="group"> TIC Group</label>
            <select name="group" value={activeGroup} onChange={(e) => setActiveGroup(e.target.value)}>
              {ticGroups.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
              <option value="all">All Groups</option>
            </select>
          </div>
        </div>

        {getFilteredTicList().length === 0 && ticList.length > 0 ? (
          <ErrorPanel
            title="No Results"
            message={
              <>
                No TICs matched your filters. If you believe this to be an error, contact the{' '}
                <Link href="mailto:rssalik14@gmail.com" borderless>
                  developers
                </Link>
              </>
            }
          />
        ) : compact ? (
          <TicTableCompact ticData={getFilteredTicList()} sortBy={sortBy} />
        ) : (
          getFilteredTicList().map((tic: any) => <TicTableRow ticData={tic} sortBy={sortBy} key={tic.ticId} />)
        )}
      </div>
    </>
  );
}

function TicTableCompact(props: { ticData: any; sortBy: string }) {
  const headerNames = [...TicBasicProperties];
  headerNames.splice(1, 0, { id: 'exofop', name: 'Exofop', shortName: 'Exofop' });

  return (
    <table className="table-compact" cellSpacing={0}>
      <thead>
        <tr>
          {headerNames.map((p) => (
            <th key={p.id} className={`${p.id} ${props.sortBy === p.id ? 'sort' : ''}`} dangerouslySetInnerHTML={{ __html: p.shortName }} />
          ))}
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
        <Link href={exofopLink(props.ticData.ticId)} newTab>
          Exofop
        </Link>
      </td>
      <td>{props.ticData.sectors.replaceAll(',', ', ')}</td>
      <td className="mono">{fixedString(props.ticData.epoch, 3)}</td>
      <td className="mono">{fixedString(props.ticData.period, 6)}</td>
      <td className="mono">{fixedString(props.ticData.duration, 2)}</td>
      <td className="mono">{props.ticData.depth}</td>
      <td className="mono">{fixedString(props.ticData.depthPercent, 3)}</td>
      <td className="mono">{fixedString(props.ticData.rPlanet, 2)}</td>
      <td className="mono">{fixedString(props.ticData.rStar, 2)}</td>
      <td className="mono">{props.ticData.tmag}</td>
      <td className="mono">{fixedString(props.ticData.deltaTmag, 2)}</td>
      <td>{props.ticData.paperDisposition?.disposition}</td>
      <td>{props.ticData.dispositionCount}</td>
    </tr>
  );
}

function TicTableRow(props: { ticData: any; sortBy: string }) {
  return (
    <div className="row">
      <div className="header">
        <ReactLink className="tic-id" to={`/tic/${props.ticData.ticId}`}>
          TIC {props.ticData.ticId}
        </ReactLink>
        <Link newTab href={exofopLink(props.ticData.ticId)}>
          Exofop
        </Link>
      </div>
      <div className="data-wrapper">
        {TicBasicProperties.filter((p) => p.id !== 'ticId').map((p) => {
          return (
            !!props.ticData[p.id] && (
              <div className={`data mono ${props.sortBy === p.id ? 'sort' : ''}`}>
                <div className="name" dangerouslySetInnerHTML={{ __html: p.name }}></div>
                <div className="value">{p.id === 'sectors' ? props.ticData[p.id].replaceAll(',', ', ') : props.ticData[p.id]}</div>
              </div>
            )
          );
        })}
        <div className="flex-br" style={{ width: '100%' }}></div>
        {props.ticData.paperDisposition && <TicDisposition data={{ ...props.ticData.paperDisposition, name: 'Paper Disposition' }} />}
        <div className="num-dispositions">{props.ticData.dispositionCount} Dispositions</div>
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

function fixedString(num: string, digits: number) {
  let flt = parseFloat(num);

  if (isNaN(flt)) {
    return num;
  }

  return flt.toFixed(digits);
}
