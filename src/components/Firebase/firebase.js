import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.database();
  }

  addGameToList = (game) => {
    const newGameKey = this.db.ref().child('games').push().key;
    let updates = {};
    updates['/games/' + newGameKey] = game;
    return this.db.ref().update(updates);
  };

  games = () => this.db.ref('games');

  signUpUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  signInUser = (email, password) => {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signOutUser = () => this.auth.signOut();

  resetUserPassword = email => this.auth.sendPasswordResetEmail(email);

  updateUserPassword = password => this.auth.currentUser.updatePassword(password);

  user = uId => this.db.ref('users/' + uId);

  users = () => this.db.ref('users');

  updateUsername = username => this.auth.currentUser.updateProfile({displayName: username})
}

export default Firebase;