import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';

export const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/profile',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
};
