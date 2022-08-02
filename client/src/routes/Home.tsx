import { ChevronRight } from '@mui/icons-material';
import Link from '../components/Link';
import { getCurrentUser } from '../handlers/authHandler';

export default function Home() {
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
        {!!getCurrentUser() ? (
          <Link href="/profile">
            Profile <ChevronRight fontSize="large" />
          </Link>
        ) : (
          <Link href="/signin">
            Sign In <ChevronRight fontSize="large" />
          </Link>
        )}
      </div>
    </div>
  );
}
