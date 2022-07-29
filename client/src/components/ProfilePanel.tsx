import { IdTokenResult, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getTicDispositions, useTicList } from '../handlers/databaseHandler';
import { auth } from '../handlers/firebase';
import TicTable from './TicTable';

export default function ProfilePanel(props: { user: User }) {
  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult | null>(null);
  const tics = useTicList();

  const [ticsWithoutUserDisposition, setTicsWithoutUserDisposition] = useState<any[]>([]);

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

      setTicsWithoutUserDisposition(arr);
    }

    if (tics) findTicsWithoutUserDisposition();
  }, [tics, props.user.uid]);

  useEffect(() => {
    if (props.user) {
      props.user.getIdTokenResult().then(setIdTokenResult);
    }
  }, [props.user]);

  return (
    <div className="profile-panel">
      <div className="title">Profile</div>
      <div className="name">
        {props.user.displayName} {idTokenResult?.claims.superuser && <div className="superuser-badge">SuperUser</div>}
      </div>
      <div
        className="sign-out"
        onClick={() => {
          auth.signOut();
          window.location.href = '/signin';
        }}
      >
        Sign Out
      </div>
      These TICs need your attention:
      <TicTable ticList={ticsWithoutUserDisposition} />
    </div>
  );
}
