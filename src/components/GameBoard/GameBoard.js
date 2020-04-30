import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';
import Player from '../Player/Player';
import ActivePlayer from '../ActivePlayer/ActivePlayer';
// import styles from './GameBoard.module.css';

const GameBoard = ( props ) => {

  const gameIndex = props.gameList.findIndex(item => item.id === props.current.id);
  const gameId = props.gameList[gameIndex].id;
  const [playerState, setPlayerState] = useState([]);
  const [stackState, setStackState] = useState([]);
  const [garbageState, setGarbageState] = useState([]);

  useEffect(() => {
    props.firebase.playerData().on('value', snapshot => {
      const data = snapshot.val();
      setPlayerState(() => {
        const newPlayerList = [];
        data[gameId].players.forEach(item => {
          newPlayerList.push({
            name: item.name,
            id: item.id,
            turn: item.turn,
            hand: item.hand,
            faceDown: item.faceDown,
            faceUp: item.faceUp,
            canFinish: item.canFinish
          });
        })
        return newPlayerList;
      })
      setStackState(data[gameId].stack);
      setGarbageState(data[gameId].garbage);
    });
  }, [props.firebase, setPlayerState, setStackState, setGarbageState]);

  const activeHandHandler = (active, card, cardInd, playerInd, gameKey) => {
    if (active) {

      let stackTop = stackState[stackState.length-1];
      let counter = 2;
      while (stackTop === 'M') {
        stackTop = stackState[stackState.length-counter];
        counter++;
      }

      if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
        const newHand = [...playerState[playerInd].hand];
        newHand.splice(cardInd, 1);
        let updatedPlayers;
        if (newHand.indexOf(card) === -1) {
          updatedPlayers = playerState.map((player, index) => {
            if (index !== playerInd) {
              player.turn--;
            } else {
              player.turn = playerState.length;
              player.canFinish = false;
              player.hand = newHand;
            }
            return player;
          })
        } else {
          updatedPlayers = playerState.map((player, index) => {
            if (index === playerInd) {
              player.canFinish = true;
              player.hand = newHand;
            }
            return player;
          })
        }
        const oldStack = [...stackState];
        props.firebase.updateStack(gameKey, [...oldStack, card]);
        props.firebase.updatePlayerData(gameKey, updatedPlayers);
        if (card === 9 && garbageState.length > 1) {
          const resInd = Math.floor(Math.random() * garbageState.length -1 ) + 1;
          const resurrect = garbageState[resInd];
          props.firebase.updateStack(gameKey, [...oldStack, card, resurrect]);
        }
      }

      if (card === 'C') {
        const newHand = [...playerState[playerInd].hand];
        newHand.splice(cardInd, 1);
        let updatedPlayers;
        if (newHand.indexOf(card) === -1) {
          updatedPlayers = playerState.map((player, index) => {
            if (index !== playerInd) {
              player.turn--;
            } else {
              player.turn = playerState.length;
              player.canFinish = false;
              player.hand = newHand;
            }
            return player;
          })
        } else {
          updatedPlayers = playerState.map((player, index) => {
            if (index === playerInd) {
              player.canFinish = true;
              player.hand = newHand;
            }
            return player;
          })
        }
        props.firebase.updateGarbage(gameKey, [...stackState, card])
        props.firebase.updateStack(gameKey, ['end']);
        props.firebase.updatePlayerData(gameKey, updatedPlayers);
      }
      
    }
  }


  const players = playerState.map((item, index) => {
    if (item.id === props.user.uid) {
      return (
        <ActivePlayer 
          name={item.name}
          key={item.id}
          id={item.id}
          playerInd={index}
          turn={item.turn}
          hand={item.hand}
          faceDown={item.faceDown}
          faceUp={item.faceUp}
          canFinish={item.canFinish}
          activeHand={activeHandHandler}
          gameId={gameId}
        />
      )
    }
    return (
      <Player 
        name={item.name}
        key={item.id}
        id={item.id}
        playerInd={index}
        turn={item.turn}
        hand={item.hand}
        faceDown={item.faceDown}
        faceUp={item.faceUp}
      />
    )
  })


  console.log(playerState);
  console.log("stack" + stackState);

  return (
    <main>
    {players}
      <div>The stack</div>
      <Link to="/main-menu">Main Menu</Link>
    </main>
  );
}

GameBoard.propTypes = {
  current: PropTypes.object.isRequired,
  gameList: PropTypes.array.isRequired,
  firebase: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default withFirebase(GameBoard);