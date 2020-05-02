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
  const [tempPlayerState, setTempPlayerState] = useState(null);
  const [tempStackState, setTempStackState] = useState(null);
  const [tempGarbageState, setTempGarbageState] = useState(null);

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

      const currPlayerState = tempPlayerState !== null ? tempPlayerState : playerState;
      const currStackState = tempStackState !== null ? tempStackState : stackState;
      const currGarbageState = tempGarbageState !== null ? tempGarbageState : garbageState;

      let stackTop = currStackState[currStackState.length-1];
      let counter = 2;
      while (stackTop === 'M') {
        stackTop = currStackState[currStackState.length-counter];
        counter++;
      }
      if (card !== 'C') {
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          const newArr= [...currPlayerState[playerInd][cardArr]];
          newArr.splice(cardInd, 1);
          if (newArr.length < 1 && currPlayerState[playerInd].faceDown[0] === 'end') { 
            console.log("Game Over");
            alert("You Won!");
            newArr.push('Game Over');
          } else {
            if (newArr.length < 1) { newArr.push('end')}
            let updatedPlayers;
            const oldStack = [...currStackState];
            
            if (newArr.indexOf(card) === -1) {
              updatedPlayers = currPlayerState.map((player, index) => {
                if (index !== playerInd) {
                  player.turn--;
                } else {
                  player.turn = currPlayerState.length;
                  player.canFinish = false;
                  player[cardArr] = newArr;
                }
                return player;
              })
              props.firebase.updateStack(gameKey, [...oldStack, card]);
              props.firebase.updatePlayerData(gameKey, updatedPlayers);
              setTempStackState(null);
              setTempPlayerState(null);
            } else {
              updatedPlayers = currPlayerState.map((player, index) => {
                if (index === playerInd) {
                  player.canFinish = true;
                  player[cardArr] = newArr;
                }
                return player;
              })
              setTempStackState([...oldStack, card]);
              setTempPlayerState(updatedPlayers);
            }                        
            if (card === 9 && currGarbageState.length > 1) {
              const resInd = Math.floor(Math.random() * currGarbageState.length -1 ) + 1;
              const resurrect = currGarbageState[resInd];
              if (resurrect === "C") {
                const newGarbage = [...currGarbageState, ...oldStack.slice(1)];
                if (newArr.indexOf(card) === -1) {
                  props.firebase.updateStack(gameKey, ['end']);
                  props.firebase.updateGarbage(gameKey, newGarbage);
                  setTempStackState(null);
                  setTempGarbageState(null);
                } else {
                  setTempStackState(['end']);
                  setTempGarbageState(newGarbage);
                }                
              } else {
                let newGarbage = [...currGarbageState];
                newGarbage.splice(resInd, 1);
                if (newArr.indexOf(card) === -1) {
                  props.firebase.updateStack(gameKey, [...oldStack, card, resurrect]);
                  props.firebase.updateGarbage(gameKey, newGarbage);
                  setTempStackState(null);
                  setTempGarbageState(null);
                } else {
                  setTempStackState([...oldStack, card, resurrect]);
                  setTempGarbageState(newGarbage);
                }               
              }
            }
          } 
        }
      }
      
      if (card === 'C') {
        const newArr = [...currPlayerState[playerInd][cardArr]];
        newArr.splice(cardInd, 1);
        if (newArr.length < 1 && currPlayerState[playerInd].faceDown[0] === 'end') { 
          console.log("Game Over");
          alert("You Won!");
          newArr.push('Game Over');
        } else {
          if (newArr.length < 1) { newArr.push('end')}
          let updatedPlayers;
          if (newArr.indexOf(card) === -1) {
            updatedPlayers = currPlayerState.map((player, index) => {
              if (index !== playerInd) {
                player.turn--;
              } else {
                player.turn = currPlayerState.length;
                player.canFinish = false;
                player[cardArr] = newArr;
              }
              return player;
            })
            props.firebase.updateGarbage(gameKey, [...currStackState, card])
            props.firebase.updateStack(gameKey, ['end']);
            props.firebase.updatePlayerData(gameKey, updatedPlayers);
            setTempGarbageState(null);
            setTempStackState(null);
            setTempPlayerState(null);
          } else {
            updatedPlayers = currPlayerState.map((player, index) => {
              if (index === playerInd) {
                player.canFinish = true;
                player[cardArr] = newArr;
              }
              return player;
            })
            setTempGarbageState([...currStackState, card]);
            setTempStackState(['end']);
            setTempPlayerState(updatedPlayers);
          }         
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
    
    const currPlayerState = tempPlayerState !== null ? tempPlayerState : playerState;
    const currStackState = tempStackState !== null ? tempStackState : stackState;
    const currGarbageState = tempGarbageState !== null ? tempGarbageState : garbageState;
    
    let updatedPlayers;
    let newHand = [...currPlayerState[playerInd].hand];
    if (currStackState.length > 1) {
      const prevStackCards = currStackState.slice(1);
      if (newHand[0] === 'end') {
        newHand = prevStackCards;
      } else {
        newHand.push(...prevStackCards);
      }
      props.firebase.updateStack(gameKey, ['end']);
      setTempStackState(null);
    } else {
      props.firebase.updateStack(gameKey, currStackState);
      setTempStackState(null);
    }
    updatedPlayers = currPlayerState.map((player, index) => {
      if (index !== playerInd) {
        player.turn--;
      } else {
        player.turn = currPlayerState.length;
        player.canFinish = false;
        player.hand = newHand;
      }
      return player;
    })
    props.firebase.updateGarbage(gameKey, currGarbageState);
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
    setTempGarbageState(null);
    setTempPlayerState(null);
  }

  const finishTurnHandler = (playerInd, gameKey) => {
    
    const currPlayerState = tempPlayerState !== null ? tempPlayerState : playerState;
    const currStackState = tempStackState !== null ? tempStackState : stackState;
    const currGarbageState = tempGarbageState !== null ? tempGarbageState : garbageState;
    
    const updatedPlayers = currPlayerState.map((player, index) => {
      if (index !== playerInd) {
        player.turn--;
      } else {
        player.turn = currPlayerState.length;
        player.canFinish = false;
      }
      return player;
    })
    props.firebase.updateGarbage(gameKey, currGarbageState);
    props.firebase.updateStack(gameKey, currStackState);
    props.firebase.updatePlayerData(gameKey, updatedPlayers); 
    setTempGarbageState(null);
    setTempStackState(null);
    setTempPlayerState(null);
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
  console.log("tempgarbage" + tempGarbageState);
  console.log("tempstack" + tempStackState);
  console.log("tempplayer" + tempPlayerState);
  

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