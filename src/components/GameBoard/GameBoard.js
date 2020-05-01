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

  const activeCardArrHandler = (active, card, cardInd, playerInd, gameKey, cardArr) => {
    if (active) {

      let stackTop = stackState[stackState.length-1];
      let counter = 2;
      while (stackTop === 'M') {
        stackTop = stackState[stackState.length-counter];
        counter++;
      }
      if (card !== 'C') {
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          const newArr= [...playerState[playerInd][cardArr]];
          newArr.splice(cardInd, 1);
          if (newArr.length < 1 && playerState[playerInd].faceDown[0] === 'end') { 
            console.log("Game Over");
            alert("You Won!");
            newArr.push('Game Over');
          } else {
            if (newArr.length < 1) { newArr.push('end')}
            let updatedPlayers;
            if (newArr.indexOf(card) === -1) {
              updatedPlayers = playerState.map((player, index) => {
                if (index !== playerInd) {
                  player.turn--;
                } else {
                  player.turn = playerState.length;
                  player.canFinish = false;
                  player[cardArr] = newArr;
                }
                return player;
              })
            } else {
              updatedPlayers = playerState.map((player, index) => {
                if (index === playerInd) {
                  player.canFinish = true;
                  player[cardArr] = newArr;
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
              if (resurrect === "C") {
                const newGarbage = [...garbageState, ...oldStack.slice(1)];
                props.firebase.updateStack(gameKey, ['end']);
                props.firebase.updateGarbage(gameKey, newGarbage);
              } else {
                let newGarbage = [...garbageState];
                newGarbage.splice(resInd, 1);
                props.firebase.updateStack(gameKey, [...oldStack, card, resurrect]);
                props.firebase.updateGarbage(gameKey, newGarbage);
              }
            }
          } 
        }
      }
      
      if (card === 'C') {
        const newArr = [...playerState[playerInd][cardArr]];
        newArr.splice(cardInd, 1);
        if (newArr.length < 1 && playerState[playerInd].faceDown[0] === 'end') { 
          console.log("Game Over");
          alert("You Won!");
          newArr.push('Game Over');
        } else {
          if (newArr.length < 1) { newArr.push('end')}
          let updatedPlayers;
          if (newArr.indexOf(card) === -1) {
            updatedPlayers = playerState.map((player, index) => {
              if (index !== playerInd) {
                player.turn--;
              } else {
                player.turn = playerState.length;
                player.canFinish = false;
                player[cardArr] = newArr;
              }
              return player;
            })
          } else {
            updatedPlayers = playerState.map((player, index) => {
              if (index === playerInd) {
                player.canFinish = true;
                player[cardArr] = newArr;
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
  }

  const activefaceDownHandler = (active, card, cardInd, playerInd, gameKey) => {
    if (active) {

      let stackTop = stackState[stackState.length-1];
      let counter = 2;
      while (stackTop === 'M') {
        stackTop = stackState[stackState.length-counter];
        counter++;
      }
      let actionTaken = false;
      
    if (card !== 'C') {
      if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
        actionTaken = true;
        const newFaceDown= [...playerState[playerInd].faceDown];
        newFaceDown.splice(cardInd, 1);
        if (newFaceDown.length < 1) { 
          console.log("Game Over");
          alert("You Won!");
          newFaceDown.push('Game Over');
        } else {
          let updatedPlayers;
          updatedPlayers = playerState.map((player, index) => {
            if (index !== playerInd) {
              player.turn--;
            } else {
              player.turn = playerState.length;
              player.faceDown = newFaceDown;
            }
            return player;
          })
          const oldStack = [...stackState];
          props.firebase.updateStack(gameKey, [...oldStack, card]);
          props.firebase.updatePlayerData(gameKey, updatedPlayers);
          if (card === 9 && garbageState.length > 1) {
            const resInd = Math.floor(Math.random() * garbageState.length -1 ) + 1;
            const resurrect = garbageState[resInd];
            
            if (resurrect === "C") {
              const newGarbage = [...garbageState, ...oldStack.slice(1)];
              props.firebase.updateStack(gameKey, ['end']);
              props.firebase.updateGarbage(gameKey, newGarbage);
            } else {
              let newGarbage = [...garbageState];
              newGarbage.splice(resInd, 1);
              props.firebase.updateStack(gameKey, [...oldStack, card, resurrect]);
              props.firebase.updateGarbage(gameKey, newGarbage);
            }
          }
        }       
      }
    }
     
      if (card === 'C') {
        actionTaken = true;
        const newFaceDown= [...playerState[playerInd].faceDown];
        newFaceDown.splice(cardInd, 1);
        if (newFaceDown.length < 1) { 
          console.log("Game Over");
          alert("You Won!");
          newFaceDown.push('Game Over');
        } else {
          let updatedPlayers;
          updatedPlayers = playerState.map((player, index) => {
            if (index !== playerInd) {
              player.turn--;
            } else {
              player.turn = playerState.length;
              player.faceDown = newFaceDown;
            }
            return player;
          })
          props.firebase.updateGarbage(gameKey, [...stackState, card])
          props.firebase.updateStack(gameKey, ['end']);
          props.firebase.updatePlayerData(gameKey, updatedPlayers);
        }
      }
      if (!actionTaken) {
        let updatedPlayers;
        let newHand= [...playerState[playerInd].hand];
        if (stackState.length > 1) {
          newHand = stackState.slice(1);
          newHand.push(card);
          props.firebase.updateStack(gameKey, ['end']);
        }
        const newFaceDown= [...playerState[playerInd].faceDown];
        newFaceDown.splice(cardInd, 1);
        if (newFaceDown.length < 1) { newFaceDown.push('end')}
        updatedPlayers = playerState.map((player, index) => {
          if (index !== playerInd) {
            player.turn--;
          } else {
            player.turn = playerState.length;
            player.canFinish = false;
            player.hand = newHand;
            player.faceDown = newFaceDown;
          }
          return player;
        })
        props.firebase.updatePlayerData(gameKey, updatedPlayers);
      }
    }
  }

  const takeStackHandler = (playerInd, gameKey) => {
    let updatedPlayers;
    let newHand= [...playerState[playerInd].hand];
    if (stackState.length > 1) {
      const prevStackCards = stackState.slice(1);
      if (newHand[0] === 'end') {
        newHand = prevStackCards;
      } else {
        newHand.push(...prevStackCards);
      }
      props.firebase.updateStack(gameKey, ['end']);
    }
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
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
  }

  const finishTurnHandler = (playerInd, gameKey) => {
    const updatedPlayers = playerState.map((player, index) => {
      if (index !== playerInd) {
        player.turn--;
      } else {
        player.turn = playerState.length;
        player.canFinish = false;
      }
      return player;
    })
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
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
          gameId={gameId}
          activeCards={activeCardArrHandler}
          activeFaceDown={activefaceDownHandler}
          finishTurn={finishTurnHandler} 
          takeStack={takeStackHandler}
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
  console.log("garbage" + garbageState);

  return (
    <main>
    {players}
      <div>Top of the stack: {stackState[stackState.length - 1]}</div>
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