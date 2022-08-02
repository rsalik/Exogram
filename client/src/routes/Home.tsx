import { ChevronRight } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import Link from '../components/Link';
import { amIAdmin } from '../handlers/databaseHandler';

export default function Home() {
  const user = useContext(UserContext);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    amIAdmin().then(setIsAdmin);
  }, []);

  return (
    <div className="home">
      <div className="title">
        Exo<span>gram</span>
      </div>
      <div className="links">
        <Link href="/table">
          TIC Table <ChevronRight fontSize="large" />
        </Link>
        <Link href="/charts">
          Light Curves <ChevronRight fontSize="large" />
        </Link>
        <Link href="/dictionary">
          Term Dictionary <ChevronRight fontSize="large" />
        </Link>
        {!!user ? (
          <Link href="/profile">
            Profile <ChevronRight fontSize="large" />
          </Link>
        ) : (
          <Link href="/signin">
            Sign In <ChevronRight fontSize="large" />
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin">
            Admin <ChevronRight fontSize="large" />
          </Link>
        )}
      </div>
    </div>
  );
}
