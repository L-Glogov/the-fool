import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/Menu/MainMenu';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Lobby from './components/Lobby/Lobby';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { withFirebase } from './components/Firebase';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';

const App = ( props ) => {
  
  const [gameList, updateGameList] = useState([]);
  const [currentGame, setCurrentGame] = useImmer({});
  const [playerName, setPlayerName] = useState('Peasant');
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

    props.firebase.auth.onAuthStateChanged(user => {
      user ? setAuthUser(user) : setAuthUser(null);
    })

  }, [props.firebase, updateGameList, setAuthUser]);

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
      host: playerName,
      players: [{
        name: playerName
      }]
    }
    setCurrentGame(draft => {
      draft.id =  gameId;
      draft.host = playerName;
      draft.players = [{name: playerName}];
    })
    
    props.firebase.addGameToList(game);

  }

  // -----Lobby Handlers-----

  const LobbyStartHandler = () => {
    console.log("The game has been started");
  }

  return (
    <Layout signedIn={authUser}>
      <Switch>
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
          path="/main-menu" 
          exact 
          render={(props) => <MainMenu 
            {...props}
            playerName={playerName}
            setPlayerName={setPlayerName}
            setCurrent={setCurrentGame}
            join={MMJoinGameHandler}
            host={MMHostGameHandler}
            gameList={gameList}
          />}
        />
        {/* The default behavior should be for the lobby to go to the host interface if somebody goes to the url without clicking the link  */}
        <Route 
          path="/lobby" 
          exact 
          render={(props) => <Lobby 
            {...props}
            start={LobbyStartHandler}
            game={currentGame}
          />}
        />
      </Switch>
    </Layout>
  );
}

App.propTypes = {
  firebase: PropTypes.object.isRequired
}

export default withFirebase(App);
