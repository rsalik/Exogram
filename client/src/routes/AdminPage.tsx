import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import AdminPanel from '../components/AdminPanel';
import ErrorPanel from '../components/ErrorPanel';
import { amIAdmin } from '../handlers/databaseHandler';

export default function AdminPage() {
  const user = useContext(UserContext);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    amIAdmin().then(setIsAdmin);
  }, [user]);

  if (user === null) return <ErrorPanel title="Access Denied" message="Sign in to access this page." />;
  if (!isAdmin) return <ErrorPanel title="Access Denied" message="You do not have permission to access this page." />;

  return <AdminPanel />;
}
