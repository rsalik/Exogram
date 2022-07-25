import { useContext } from 'react';
import { UserContext } from '../App';
import { uiConfig } from '../handlers/authHandler';
import { auth } from '../handlers/firebase';
import StyledFirebaseAuth from './StyledFirebaseAuth';

export default function SignInPanel() {
  if (useContext(UserContext) !== null) window.location.href = '/profile';

  return (
    <div className="sign-in">
      <div className="title">Sign In</div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}
