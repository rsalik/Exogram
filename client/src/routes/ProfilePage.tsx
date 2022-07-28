import { IdTokenResult } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import ErrorPanel from '../components/ErrorPanel';
import Link from '../components/Link';

export default function ProfilePage() {
  const user = useContext(UserContext);

  const [idTokenResult, setIdTokenResult] = useState<IdTokenResult | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdTokenResult().then(setIdTokenResult);
    }
  }, [user]);

  if (user === null)
    return (
      <ErrorPanel
        title="You are not signed in"
        message={
          <>
            Click <Link href="/signin">here</Link> to go to the sign in page.
          </>
        }
      />
    );

  console.log(idTokenResult);

  return (
    <div className="profile-page">
      <div className="title">Profile</div>
      <div className="name">{user?.displayName}</div>
    </div>
  );
}
