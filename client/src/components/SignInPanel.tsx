import { uiConfig } from "../handlers/authHandler";
import { auth } from "../handlers/firebase";
import StyledFirebaseAuth from "./StyledFirebaseAuth";


export default function SignInPanel() {
  return <div className="sign-in">
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
  </div>
}