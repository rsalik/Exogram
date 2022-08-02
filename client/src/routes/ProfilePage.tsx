import { useContext } from 'react';
import { UserContext } from '../App';
import ErrorPanel from '../components/ErrorPanel';
import Link from '../components/Link';
import ProfilePanel from '../components/ProfilePanel';

export default function ProfilePage() {
  const user = useContext(UserContext);

  if (user === null)
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

  return <ProfilePanel user={user} />;
}
