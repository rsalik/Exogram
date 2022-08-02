import { Person } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { amIAdmin } from '../handlers/databaseHandler';

export function Header() {
  return (
    <div className="header">
      <HeaderAndFooterContent />
      <UserContext.Consumer>
        {(user) => {
          return (
            <Link to={`/${!!user ? 'profile' : 'signin'}`}>
              <div className={`${!!user ? 'signed-in' : ''} profile`}>{<Person fontSize="large" />}</div>
            </Link>
          );
        }}
      </UserContext.Consumer>
    </div>
  );
}

export function Footer() {
  return (
    <div className="footer">
      <HeaderAndFooterContent />
    </div>
  );
}

function HeaderAndFooterContent() {
  const user = useContext(UserContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    amIAdmin().then(setIsAdmin);
  }, [user]);

  return (
    <div className="content">
      <div className="title">
        <Link to="/">
          Exo<span>gram</span>
        </Link>
      </div>
      <div className="links">
        <Link to="/table">Table</Link>
        <div className="sep">/</div>
        <Link to="/charts">Light Curves</Link>
        <div className="sep">/</div>
        <Link to="/dictionary">Dictionary</Link>
        {isAdmin && (
          <>
            <div className="sep">/</div>
            <Link to="/admin">Admin</Link>
          </>
        )}
      </div>
    </div>
  );
}
