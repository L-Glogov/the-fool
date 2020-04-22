import React, { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import GameBoard from './components/GameBoard/GameBoard';
import MainMenu from './components/Menu/MainMenu';
import { Switch, Route } from 'react-router-dom';
import Lobby from './components/Lobby/Lobby';
import { useImmer } from 'use-immer';
import { v4 as uuidv4 } from 'uuid';
import { withFirebase } from './components/Firebase';

const App = ( props ) => {
  
  const [gameList, updateGameList] = useImmer([]);
  const [currentGame, setCurrentGame] = useImmer({});
  const [playerName, setPlayerName] = useState('Peasant');
  const [ruleGameListDisp, setRuleGameListDisp] = useState('rules');
  
  useEffect(() => {

  }, []);

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
    updateGameList(draft => {
      draft.push(game);
    })
    setCurrentGame(draft => {
      draft.id =  gameId;
      draft.host = playerName;
      draft.players = [{name: playerName}];
    })
    
    props.firebase.updateGameList(game);

  }

  const MMRulesHandler = () => {
    setRuleGameListDisp('rules');
  }

  const MMGameListHandler = () => {
    setRuleGameListDisp('gameList');
  }

  // -----Lobby Handlers-----

  const LobbyStartHandler = () => {
    console.log("The game has been started");
  }

  return (
    <Layout>
      <Switch>
        <Route 
          path="/gameboard" 
          exact 
          render={GameBoard}
        />
        <Route 
          path="/main-menu" 
          exact 
          render={(props) => <MainMenu 
            {...props}
            playerName={playerName}
            setPlayerName={setPlayerName}
            join={MMJoinGameHandler}
            host={MMHostGameHandler}
            rules={MMRulesHandler}
            gameListHandler={MMGameListHandler}
            gameList={gameList}
            ruleGameListDisp={ruleGameListDisp}

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

export default withFirebase(App);
