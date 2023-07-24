import { useEffect, useState } from 'react';
import { getAllUsernames, getEBDispCounts } from '../../handlers/databaseHandler';

export default function EBLeaderboard() {
  const [users, setUsers] = useState([] as { uid: string; count: number }[]);
  const [usernames, setUsernames] = useState({} as { [uid: string]: string });

  useEffect(() => {
    getEBDispCounts().then((res) => {
      setUsers(Object.keys(res).map((uid) => ({ uid, count: res[uid] })).sort((a, b) => b.count - a.count).slice(0, 10));
      getAllUsernames(Object.keys(res)).then(setUsernames);
    });
  }, []);

  return (
    <div className="ebs-table-panel">
      <div className="title">Leaderboard</div>
      <div className="tic-disposition-table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th># Dispositions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{usernames[user.uid]}</td>
                <td>{user.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
