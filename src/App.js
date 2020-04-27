import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/Menu/MainMenu';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Lobby from './components/Lobby/Lobby';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { withFirebase } from './components/Firebase';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import ResetPass from './components/ResetPass/ResetPass';
import ChangePass from './components/ChangePass/ChangePass';

const App = ( props ) => {
  
  const [gameList, updateGameList] = useState([]);
  const [currentGame, setCurrentGame] = useImmer({});
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

  const MMJoinGameHandler = () => {
    console.log("Join game clicked");
    // Add join game mechanic
  }

  const MMHostGameHandler = () => {
    console.log("Host game clicked");
    const gameId = uuidv4();
    const game = {
      id: gameId,
      host: authUser.displayName,
      players: [{
        name: authUser.displayName
      }]
    }
    setCurrentGame(draft => {
      draft.id =  gameId;
      draft.host = authUser.displayName;
      draft.players = [{name: authUser.displayName}];
    })
    
    props.firebase.addGameToList(game);

  }

  // -----Lobby Handlers-----

  const LobbyStartHandler = () => {
    console.log("The game has been started");
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
        join={MMJoinGameHandler}
        host={MMHostGameHandler}
        gameList={gameList}
        user={authUser}
      />}
    />
    <Route 
      path="/lobby" 
      exact 
      render={(props) => <Lobby 
        {...props}
        start={LobbyStartHandler}
        game={currentGame}
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
        join={MMJoinGameHandler}
        host={MMHostGameHandler}
        gameList={gameList}
        user={authUser}
      />}
    />
    <Redirect to="/main-menu" />
  </Switch>

        console.log(authUser);
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
