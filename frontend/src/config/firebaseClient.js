import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAJ_zMyMaJ7Y_jNJIVX-01h_EvldLNhDNI',
  authDomain: 'autoflow-fc4fb.firebaseapp.com',
  projectId: 'autoflow-fc4fb',
  storageBucket: 'autoflow-fc4fb.firebasestorage.app',
  messagingSenderId: '308980379288',
  appId: '1:308980379288:web:9fe905cef1364347e22aed',
  measurementId: 'G-HV50R7WC1T',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export default auth;
