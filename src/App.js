import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/Menu/MainMenu';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Lobby from './components/Lobby/Lobby';
import { useImmer } from 'use-immer';
// import { v4 as uuidv4 } from 'uuid';
import { withFirebase } from './components/Firebase';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import ResetPass from './components/ResetPass/ResetPass';
import ChangePass from './components/ChangePass/ChangePass';

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
            players: data[key].players
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

  const MMJoinGameHandler = (hist) => {
    console.log("Join game clicked");
    let isPlaying = false;
    currentGame.players.forEach(element => {
      if (element.id === authUser.uid) {
        isPlaying = true;
      }
    });
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

  const MMHostGameHandler = (hist) => {
    console.log("Host game clicked");
    const gameKey = props.firebase.newGameKey();
    const game = {
      id: gameKey,
      host: authUser.displayName,
      hostId: authUser.uid,
      players: [{
        name: authUser.displayName,
        id: authUser.uid,
        ready: false
      }]
    }
    setCurrentGame(draft => {
      draft.id = gameKey;
      draft.host = authUser.displayName;
      draft.hostId = authUser.uid;
      draft.players = [{
        name: authUser.displayName,
        id: authUser.uid, 
        ready: false
      }];
    })

    props.firebase.addGameToList(game, gameKey);
    hist.push("/lobby/" + gameKey); 
  }

  // -----Lobby Handlers-----

  const LobbyStartHandler = () => {
    console.log("The game has been started");
  }

  const LobbyUpdatePlayers = (gameKey, updatedPlayers) => {
    props.firebase.updateGamePlayers(gameKey, updatedPlayers);
    setCurrentGame(draft => {
      draft.players = updatedPlayers;
    });
  }

   
  const guarded = <Switch>
    <Route 
      path="/gameboard" 
      exact 
      render={(props) => <GameBoard 
        {...props}
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
    {/* <Route 
      path="/lobby/:gameid" 
      exact 
      render={(props) => <Lobby 
        {...props}
        start={LobbyStartHandler}
        gameList={gameList}
        current={currentGame}
        updatePlayers={LobbyUpdatePlayers}
        user={authUser}
      />}
    /> */}
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
