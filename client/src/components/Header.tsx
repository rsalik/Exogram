import { Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';

export function Header() {
  return (
    <div className="header">
      <HeaderAndFooterContent />
      <UserContext.Consumer>
        {(user) => {
          return (
            <Link to={`/${!!user ? 'profile' : 'signin'}`}>
              <div className={`${!!user ? 'signed-in' : ''} profile`} >{<Person fontSize="large" />}</div>
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
  return (
    <div className="content">
      <div className="title">
        <Link to="/">
          Exo<span>gram</span>
        </Link>
      </div>
      <div className="links">
        <Link to="/table">TIC Table</Link>
        <div className="sep">/</div>
        <Link to="/charts">TIC Charts</Link>
        <div className="sep">/</div>
        <Link to="/dictionary">Dictionary</Link>
      </div>
    </div>
  );
}
