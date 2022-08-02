import {
  setTicGroupReadPermission,
  setTicGroupWritePermission,
  setUserSuperuserStatus,
  useTicGroups,
  useUsers,
} from '../handlers/databaseHandler';
import Link from './Link';

export default function AdminPanel() {
  const ticGroups = useTicGroups();
  const users = useUsers();

  return (
    <div className="admin-panel">
      <div className="title">Admin Settings</div>
      <div className="groups">
        <div className="title">TIC Groups</div>
        {ticGroups.map((group) => (
          <div key={group.id} className="group">
            <div className="name">{group.name}</div>
            <div
              onClick={() => {
                setTicGroupWritePermission(group.id, !group.write);
              }}
              className={`write ${group.write ? 'on' : 'off'}`}
            >
              Write {group.write ? 'On' : 'Off'}
            </div>
            <div
              onClick={() => {
                setTicGroupReadPermission(group.id, !group.public);
              }}
              className={`public ${group.public ? 'on' : 'off'}`}
            >
              {group.public ? 'Public' : 'Private'}
            </div>
          </div>
        ))}
      </div>
      <div className="users">
        <div className="title">Users</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>UID</th>
              <th>User Type</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="user" key={user.uid}>
                <td className="name">{user.name}</td>
                <td className="email">
                  <Link external href={`mailto:${user.email}`}>
                    {user.email}
                  </Link>
                </td>
                <td className={`uid mono`}>{user.uid}</td>
                <td>
                  <div
                    className={`superuser ${user.superuser ? 'active' : ''}`}
                    onClick={() => {
                      setUserSuperuserStatus(user.uid, !user.superuser);
                    }}
                  >
                    {' '}
                    {user.superuser ? 'SuperUser' : 'User'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
