import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { getAllTicDispositionsRaw, useTicGroups, useTicList } from '../handlers/databaseHandler';
import ErrorPanel from './ErrorPanel';
import { FloatingSearchBar } from './FloatingSearchBar';
import Link from './Link';

const MyDispositionsSortByOptions = [
  { name: 'TIC ID', value: 'ticId' },
  { name: 'Disposition', value: 'disposition' },
];

export default function MyDispositionsTable() {
  const ticList = useTicList();
  const ticGroups = useTicGroups();

  const user = useContext(UserContext);

  const [dispositions, setDispositions] = useState<any>(undefined);

  const [activeGroup, setActiveGroup] = useState('all');
  const [sortBy, setSortBy] = useState('ticId');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllTicDispositionsRaw(ticList).then(setDispositions);
  }, [ticList]);

  if (!dispositions) return <></>;

  if (!user)
    return (
      <ErrorPanel
        title="You are not signed in"
        message={
          <>
            Click{' '}
            <Link href="/signin" borderless>
              here
            </Link>{' '}
            to go to the sign in page.
          </>
        }
      />
    );

  function getFilteredTicList() {
    return myDispositionSortTicList(
      myDispositionsSearchTicList(
        ticList.filter((t) => !!dispositions[t.ticId] && !!dispositions[t.ticId][user?.uid || '']),
        search,
        dispositions,
        user?.uid
      ),
      dispositions,
      sortBy,
      user?.uid
    ).filter((t: any) => activeGroup === 'all' || t.group === parseInt(activeGroup));
  }

  return (
    <>
      <FloatingSearchBar value={search} onChange={setSearch} />
      <div className="tic-table">
        <div className="title">{'My Dispositions'}</div>
        <div className="settings">
          &nbsp;
          <div className="sort-by">
            <label htmlFor="sortby"> Sort by</label>
            <select name="sortby" onChange={(e) => setSortBy(e.target.value)}>
              {MyDispositionsSortByOptions.map((o) => (
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
        ) : (
          <table className="table-compact" cellSpacing={0} style={{ 'fontSize': '1.1em'}}>
            <thead>
              <tr>
                <th>TIC ID</th>
                <th>My Disposition</th>
                <th>My Comments</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredTicList().map((t: any) => (
                <tr
                  className="tic"
                  key={t.ticId}
                  onClick={() => {
                    window.open(`/tic/${t.ticId}`);
                  }}
                >
                  <td className="tic-id mono">{t.ticId}</td>
                  <td>{dispositions[t.ticId][user?.uid]?.disposition}</td>
                  <td>{dispositions[t.ticId][user?.uid]?.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function myDispositionSortTicList(ticList: any[], dispositions: any[], sortBy: string, userId?: string) {
  if (!userId) return [];

  return ticList.sort((a, b) => {
    if (sortBy === 'disposition') return dispositions[a.ticId][userId].disposition.localeCompare(dispositions[b.ticId][userId].disposition);

    return a.ticId.localeCompare(b.ticId);
  });
}

function myDispositionsSearchTicList(ticList: any[], search: string, dispositions: any, userId?: string) {
  search = search.toLowerCase();

  if (!userId) return [];

  return ticList.filter((tic) => {
    return !search
      .split(',')
      .map((t) => t.trim())
      .map((s) => {
        if (tic.ticId.startsWith(s)) return true;

        if (!dispositions[tic.ticId][userId]) return false;
        if (dispositions[tic.ticId][userId].disposition.toLowerCase().includes(s)) return true;
        if (dispositions[tic.ticId][userId].comments.toLowerCase().includes(s)) return true;

        return false;
      })
      .includes(false);
  });
}
