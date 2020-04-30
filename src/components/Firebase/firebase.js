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

  newGameKey = () => this.db.ref().child('games').push().key;

  addGameToList = (game, gameKey) => {
    let updates = {};
    updates['/games/' + gameKey] = game;
    return this.db.ref().update(updates);
  };

  games = () => this.db.ref('games');

  updateGameStatus = (gameKey, gameStatus) => {
    let updates = {};
    updates['/games/' + gameKey + '/started'] = gameStatus;
    return this.db.ref().update(updates);
  }

  updateGamePlayers = (gameKey, updatedPlayers) => {
    let updates = {};
    updates['/games/' + gameKey + '/players'] = updatedPlayers;
    return this.db.ref().update(updates);
  }

  addPlayerData = (players, gameKey) => {
    let updates = {};
    updates['/player-state/' + gameKey] = players;
    return this.db.ref().update(updates);
  };

  updatePlayerData = (gameKey, updatedPlayers) => {
    let updates = {};
    updates['/player-state/' + gameKey + '/players'] = updatedPlayers;
    return this.db.ref().update(updates);
  };

  // updatePlayerHandData = (gameKey, playerInd, hand) => {
  //   let updates = {};
  //   updates['/player-state/' + gameKey + '/players/' + playerInd + '/hand/'] = hand;
  //   return this.db.ref().update(updates);
  // };

  updateStack = (gameKey, stack) => {
    let updates = {};
    updates['/player-state/' + gameKey + '/stack'] = stack;
    return this.db.ref().update(updates);
  }

  updateGarbage = (gameKey, garbage) => {
    let updates = {};
    updates['/player-state/' + gameKey + '/garbage'] = garbage;
    return this.db.ref().update(updates);
  }

  playerData = () => this.db.ref('player-state');

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