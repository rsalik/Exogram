import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { amIAdmin, amISuperuser, getTicDispositions, useTicGroups, useTicList } from '../handlers/databaseHandler';
import { auth } from '../handlers/firebase';
import InfoPanel from './InfoPanel';
import MyDispositionsTable from './MyDispositionsTable';
import TicTable from './TicTable';

export default function ProfilePanel(props: { user: User }) {
  const tics = useTicList();
  const ticGroups = useTicGroups();

  const [ticsWithoutUserDisposition, setTicsWithoutUserDisposition] = useState<any[]>([]);
  const [dispositionCount, setDispositionCount] = useState(0);

  const [isSuperuser, setIsSuperuser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeTable, setActiveTable] = useState('');

  useEffect(() => {
    amISuperuser().then(setIsSuperuser);
    amIAdmin().then(setIsAdmin);
  }, []);

  useEffect(() => {
    async function findTicsWithoutUserDisposition() {
      const promises = [];
      const arr = [] as any[];

      async function getTicDispositionsWithId(tic: any) {
        const dispositions = await getTicDispositions(tic.ticId);
        return { tic, dispositions };
      }

      for (let tic of tics) {
        promises.push(getTicDispositionsWithId(tic));
      }

      const results = await Promise.all(promises);
      results.forEach(({ tic, dispositions }) => {
        if (!dispositions) return;

        if (!dispositions.find((d) => d.userId === props.user.uid)) {
          arr.push(tic);
        }
      });

      setTicsWithoutUserDisposition(
        arr.filter((t: any) => {
          return ticGroups.filter((g: any) => g.id === t.group.toString())[0]?.write;
        })
      );
      setDispositionCount(tics.length - arr.length);
    }

    if (tics) findTicsWithoutUserDisposition();
  }, [tics, ticGroups, props.user.uid]);

  return (
    <>
      <div className="profile-panel">
        <div className="title">
          Profile{' '}
          <div
            className="sign-out"
            onClick={() => {
              auth.signOut();
              window.location.href = '/signin';
            }}
          >
            Sign Out
          </div>
        </div>
        <div className="name">
          {props.user.displayName} {isSuperuser && <div className="superuser-badge">SuperUser</div>}{' '}
          {isAdmin && <div className="superuser-badge">Admin</div>}
        </div>
        <div className="stats">
          <div
            className={`stat clickable${activeTable === 'dispositions' ? ' active' : ''}`}
            onClick={() => setActiveTable('dispositions')}
          >
            <div className="name">Dispositions</div>
            <div className="value">{dispositionCount}</div>
          </div>
          <div className={`stat clickable${activeTable === 'attention' ? ' active' : ''}`} onClick={() => setActiveTable('attention')}>
            <div className="name">Need Attention</div>
            <div className="value">{ticsWithoutUserDisposition.length}</div>
          </div>
          <div className="stat">
            <div className="name">Email</div>
            <div className="value">{props.user.email}</div>
          </div>
        </div>
      </div>
      {activeTable === 'attention' && <TicTable title="Needs Your Attention" ticList={ticsWithoutUserDisposition} />}
      {activeTable === 'dispositions' && <MyDispositionsTable />}
      {activeTable === '' && <InfoPanel  title="View Table" message={`Click "Dispositions" or "Need Attention" to view a table of those targets. `} />}
    </>
  );
}
