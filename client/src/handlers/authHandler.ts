import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { writeUserData } from './databaseHandler';
import { auth } from './firebase';

export const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/profile',
  signInOptions: [GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID],
};

export function getCurrentUser() {
  return auth.currentUser;
}

auth.onAuthStateChanged((user) => {
  if (user) {
    writeUserData();
  }
});
