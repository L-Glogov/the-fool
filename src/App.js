import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/Menu/MainMenu';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Lobby from './components/Lobby/Lobby';
import { useImmer } from 'use-immer';
import { withFirebase } from './components/Firebase';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import ResetPass from './components/ResetPass/ResetPass';
import ChangePass from './components/ChangePass/ChangePass';
import Home from './components/Home/Home';

const App = ( props ) => {
  
  const [gameList, updateGameList] = useState([]);
  const [currentGame, setCurrentGame] = useImmer({id: null});
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    props.firebase.games().on('value', snapshot => {
      updateGameList(() => {
        const data = snapshot.val();
        const newList = [];
        for (const key in data) {         
          newList.push({
            id: data[key].id,
            host: data[key].host,
            hostId: data[key].hostId,
            players: data[key].players,
            started: data[key].started,
            winner: data[key].winner
          });
        }
        return newList;
      })
    });
  }, [props.firebase, updateGameList]);

  useEffect(() => {
    props.firebase.auth.onAuthStateChanged(authUser => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    })
  }, [props.firebase, setAuthUser])

  // -----MainMenu Handlers-----


  /**
   * The function redirects the user to the lobby if the player is already a part of a given game or if there is still room to join for the player, in which case it updates firebase with the players name and id.
   *
   * @param {Object} hist - The current react-router history Object.
   */
  const MMJoinGameHandler = (hist) => {
    
    const checkIfPlaying = (currentUserId) => {
      let isPlaying = false;
      currentGame.players.forEach(element => {
        if (element.id === currentUserId) {
          isPlaying = true;
        }
      });
      return isPlaying;
    }
    const isPlaying = checkIfPlaying(authUser.uid);

    if (currentGame.players.length < 4 || isPlaying) {
      if(!isPlaying) {
        const updatedPlayers = [...currentGame.players, {name: authUser.displayName, id: authUser.uid, ready: false}];
        setCurrentGame(draft => {
          draft.players = updatedPlayers;
        });
        props.firebase.updateGamePlayers(currentGame.id, updatedPlayers);
      }
      hist.push("/lobby/" + currentGame.id); 
    } else {
      alert("The game is full. Please choose another.")
    }
  }


  /**
   * The function creates a new game with the current user as host and updates firebase with the users data. It also redirects the user to the game lobby.
   *
   * @param {Object} hist - The current react-router history Object.
   */
  const MMHostGameHandler = (hist) => {
    const gameKey = props.firebase.newGameKey();
    const game = {
      id: gameKey,
      host: authUser.displayName,
      hostId: authUser.uid,
      players: [{
        name: authUser.displayName,
        id: authUser.uid,
        ready: false
      }],
      started: false,
      winner: {
        won: false,
        name: null,
        time: null
      }
    }
    setCurrentGame(draft => {
      draft.id = game.id;
      draft.host = game.host;
      draft.hostId = game.hostId;
      draft.players = game.players;
      draft.started = game.started;
      draft.winner = game.winner;
    })

    props.firebase.addGameToList(game, gameKey);
    hist.push("/lobby/" + gameKey); 
  }

  // -----Lobby Handlers-----

  /**
   * The function initilizes the game by changing its gameStatus and creates random starting decks for the players and a random turn order.
   *
   * @param {string} gameKey - The id of the current game.
   * @param {Object[]} players - The players taking part in the game.
   * @param {string} players[].name The player's name.
   * @param {string} players[].id The player's id.
   */
  const LobbyStartHandler = (gameKey, players) => {
  
    const getDeckArr = (numPlayers) => {
      const baseDeck = [1,2,3,4,5,6,7,8,9,10,11,'C','M'];
      let deck = [];
      for (let n = 1; n <= numPlayers; n++) {
        deck.push(...baseDeck);
      }
      return deck;
    }

    const getTurnArr = (numPlayers) => {
      let turnArr = [];
      for (let n = 1; n <= numPlayers; n++) {
        turnArr.push(n);
      }
      return turnArr;
    }

    const deck = getDeckArr(players.length);
    const turnArr = getTurnArr(players.length);

    const pickRnd = (arr) => {
      return arr.splice(Math.floor(Math.random()*arr.length), 1)[0];
    }

    const shuffle = (num, arr) => {
      const cardSet = [];
      for (let n = 1; n <= num; n++) {
        cardSet.push(pickRnd(arr));
      }
      return cardSet;
    }

    const createPlayerArr = (gamePlayers) => {
      const STARTING_HAND_CARDS = 5;
      const STARTING_FACE_DOWN_CARDS = 4;
      const STARTING_FACE_UP_CARDS = 4;    
      const playersArr = [];

      gamePlayers.forEach(player => {
        const turn = shuffle(1, turnArr)[0];
        const handCards = shuffle(STARTING_HAND_CARDS, deck);
        const faceDownCards = shuffle(STARTING_FACE_DOWN_CARDS, deck);
        const faceUpCards = shuffle(STARTING_FACE_UP_CARDS, deck);
        playersArr.push({
          name: player.name,
          id: player.id,
          turn: turn,
          hand: handCards,
          faceDown: faceDownCards,
          faceUp: faceUpCards,
          canFinish: false
        })
      })
      return playersArr;
    }

    const playersArr = createPlayerArr(players);    
    const playerState = {
      players: playersArr,
      stack: ["end"],
      garbage: ["end"],
      log: [{
        name: 'startgame',
        card: null
      }]
    }

    props.firebase.addPlayerData(playerState, gameKey);
    props.firebase.updateGameStatus(gameKey, true);
  }

  const LobbyUpdatePlayers = (gameKey, updatedPlayers) => {
    props.firebase.updateGamePlayers(gameKey, updatedPlayers);
    setCurrentGame(draft => {
      draft.players = updatedPlayers;
    });
  }

  // -----GameBoard Handlers-----
   
  const GBSetWinner = (gameKey, name) => {
    const time = Date.now();
    const winnerObj = {
      won: true,
      name,
      time
    }
    props.firebase.updateGameWinner(gameKey, winnerObj)
    setCurrentGame(draft => {
      draft.winner.name = name;
      draft.winner.time = name;
      draft.winner.won = true;
    })
  }

  // -----Routes-----

  const guarded = <Switch>
    <Route 
      path="/gameboard/:gameid" 
      exact 
      render={(props) => <GameBoard 
        {...props}
        current={currentGame}
        gameList={gameList}
        user={authUser}
        setWinner={GBSetWinner}
      />}
    />
    <Route 
      path="/signin" 
      exact 
      render={(props) => <SignIn 
        {...props}
      />}
    />
    <Route 
      path="/signup" 
      exact 
      render={(props) => <SignUp 
        {...props}
      />}
    />
    <Route 
      path="/reset-pass" 
      exact 
      render={(props) => <ResetPass 
        {...props}
      />}
    />
    <Route 
      path="/change-pass" 
      exact 
      render={(props) => <ChangePass 
        {...props}
      />}
    />
    <Route 
      path="/main-menu" 
      exact 
      render={(props) => <MainMenu 
        {...props}
        setCurrent={setCurrentGame}
        current={currentGame}
        join={MMJoinGameHandler}
        host={MMHostGameHandler}
        gameList={gameList}
        user={authUser}
      />}
    />
    <Route 
      path="/lobby/:gameid" 
      exact 
      render={(props) => <Lobby 
        {...props}
        start={LobbyStartHandler}
        current={currentGame}
        gameList={gameList}
        updatePlayers={LobbyUpdatePlayers}
        user={authUser}
      />}
    />
    <Route 
      path="/" 
      exact 
      render={(props) => <Home 
        {...props}
        user={authUser}
      />}
    />
    <Redirect to="/main-menu" />
  </Switch>

  const unGuarded = <Switch>
    <Route 
      path="/signin" 
      exact 
      render={(props) => <SignIn 
        {...props}
      />}
    />
    <Route 
      path="/signup" 
      exact 
      render={(props) => <SignUp 
        {...props}
      />}
    />
    <Route 
      path="/reset-pass" 
      exact 
      render={(props) => <ResetPass 
        {...props}
      />}
    />
    <Route 
      path="/change-pass" 
      exact 
      render={(props) => <ChangePass 
        {...props}
      />}
    />
    <Route 
      path="/main-menu" 
      exact 
      render={(props) => <MainMenu 
        {...props}
        setCurrent={setCurrentGame}
        current={currentGame}
        join={MMJoinGameHandler}
        host={MMHostGameHandler}
        gameList={gameList}
        user={authUser}
      />}
    />
    <Route 
      path="/" 
      exact 
      render={(props) => <Home 
        {...props}
        user={authUser}
      />}
    />
    <Redirect to="/main-menu" />
  </Switch>

  return (
    <Layout signedIn={authUser}>
      {authUser !== null ? guarded : unGuarded}
    </Layout>
  );
}

App.propTypes = {
  firebase: PropTypes.object.isRequired
}

export default withFirebase(App);
