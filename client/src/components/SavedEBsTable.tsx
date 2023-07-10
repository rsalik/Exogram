import { useEffect, useState } from 'react';
import { getMyEBResponse, getUserPhoto, getUsername } from '../handlers/databaseHandler';
import InfoPanel from './InfoPanel';

export default function SavedEBsTable(props: { ebs: { ticId: string; uids: string[] }[]; showUsers: boolean }) {
  const [ebs, setEbs] = useState<any[]>([]);
  const [users, setUsers] = useState({} as { [uid: string]: { photo: string | null; name: string } });

  useEffect(() => {
    function getEBs() {
      let arr = [] as any[];
      let promises = [];
      let uniqueUids = new Set<string>();

      if (!props.ebs) return;

      for (let obj of props.ebs) {
        for (let uid of obj.uids) {
          uniqueUids.add(uid);
        }

        promises.push(
          (async () => {
            return { ...(await getMyEBResponse(obj.ticId)), ...obj };
          })()
        );
      }

      Promise.all(promises).then((res) => {
        res.forEach((r) => {
          arr.push(r);
        });

        // sort by ticId
        arr.sort((a, b) => {
          if (a.ticId < b.ticId) {
            return -1;
          }
          if (a.ticId > b.ticId) {
            return 1;
          }
          return 0;
        });

        setEbs(arr);
      });

      let photoPromises = [] as Promise<{ photo: any; name: any; uid: any }>[];
      let users = {} as { [uid: string]: { photo: string | null; name: string } };

      uniqueUids.forEach((uid) => {
        photoPromises.push(
          (async () => {
            return { uid, photo: await getUserPhoto(uid), name: await getUsername(uid) };
          })() as Promise<{ photo: any; uid: any; name: any }>
        );
      });

      Promise.all(photoPromises).then((res) => {
        res.forEach((r) => {
          users[r.uid] = { photo: r.photo, name: r.name };
        });
        setUsers(users);
      });
    }

    getEBs();
  }, [props]);

  if (!props.ebs) return <InfoPanel title="This Table Is Empty" />;

  return (
    <div className="tic-table">
      <table className="table-compact">
        <thead>
          <tr>
            <th>TIC ID</th>
            <th>Your Response to "Is Eclipsing Binary"</th>
            <th>Your Response to "Is Measured Period Correct"</th>
            <th>Your Comments</th>
            {props.showUsers && <th>Saved By</th>}
          </tr>
        </thead>
        <tbody>
          {ebs.map((eb) => (
            <tr onClick={() => window.open('/ebs/lookup/' + eb.ticId)} className="tic" key={eb.ticId}>
              <td className="mono">{eb.ticId}</td>
              <td>{eb.isEB !== undefined ? (eb.isEB ? 'Yes' : 'No') : ''}</td>
              <td>{eb.isPeriodCorrect !== undefined ? (eb.isPeriodCorrect ? 'Yes' : 'No') : ''}</td>
              <td>{eb.comments}</td>
              {props.showUsers && (
                <td>
                  <div className="photos">
                    {eb.uids.map((uid: string) => {
                      if (users[uid]) {
                        return <UserPhoto key={uid} photo={users[uid].photo} name={users[uid].name} />;
                      }
                      return null;
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserPhoto(props: { photo: string | null; name: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) setShowTooltip(false);
  }, [hovering, showTooltip]);

  return (
    <div
      className="photo"
      onMouseEnter={() => {
        setHovering(true);
        setTimeout(() => {
          setShowTooltip(true);
        }, 200);
      }}
      onMouseLeave={() => setHovering(false)}
    >
      {showTooltip && (
        <div className="hover">
          <div className="name">{props.name}</div>
        </div>
      )}
      {props.photo ? (
        <img className="user-photo" referrerPolicy="no-referrer" src={props.photo} alt={props.name} />
      ) : (
        <div className="user-photo"><span>{props.name[0]}</span></div>
      )}
    </div>
  );
}
