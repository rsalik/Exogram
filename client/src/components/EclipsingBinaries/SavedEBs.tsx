import { useContext, useEffect, useState } from 'react';
import { getSavedEBs } from '../../handlers/databaseHandler';
import InfoPanel from '../InfoPanel';
import { UserContext } from '../../App';
import SavedEBsTable from '../SavedEBsTable';

export default function SavedEBs() {
  const [loading, setLoading] = useState(true);
  const [savedEBs, setSavedEBs] = useState({} as { [uid: string]: string[] });
  const [showGlobal, setShowGlobal] = useState(true);
  const [globalEBs, setGlobalEBs] = useState([] as { ticId: string, uids: string[] }[]);
  const [mySavedEBs, setMySavedEBs] = useState([] as { ticId: string, uids: string[] }[]);

  const user = useContext(UserContext);

  useEffect(() => {
    getSavedEBs().then((res) => {
      setSavedEBs(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setGlobalEBs(
      Object.entries(savedEBs).reduce((acc: { ticId: string; uids: string[] }[], [uid, ticIds]) => {
        ticIds.forEach((ticId) => {
          const existingEB = acc.find((eb) => eb.ticId === ticId);
          if (existingEB) {
            existingEB.uids.push(uid);
          } else {
            acc.push({ ticId, uids: [uid] });
          }
        });
        return acc;
      }, [])
    );
  }, [savedEBs]);

  useEffect(() => {
    if (user) {
      setMySavedEBs(
        savedEBs[user.uid]?.map((ticId) => {
          return { ticId, uids: [user.uid] };
        })
      );
    }
  }, [savedEBs, user]);

  if (loading) {
    return <InfoPanel title="Loading..." />;
  }

  return (
    <div className="saved-panel">
      <div className="title">Saved EBs</div>
      <div className="btns">
        <div className={`btn ${showGlobal ? 'active' : ''}`} onClick={() => setShowGlobal(true)}>
          Global
        </div>
        {user && <div className={`btn ${showGlobal ? '' : 'active'}`} onClick={() => setShowGlobal(false)}>
          My Saved
        </div>}
      </div>

      <SavedEBsTable ebs={showGlobal ? globalEBs : mySavedEBs} showUsers={showGlobal} />
    </div>
  );
}
