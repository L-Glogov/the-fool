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


  /* -----Utility functions for the ActivePlayer handlers ------ */

  /**
   * These are temporary measures and will be replaced with proper end game mechanics at a later date.
   *
   * @param {Object[]} newArr - The current card array.
   */
  const gameOver = (newArr) => {
    console.log("Game Over");
    alert("You Won!");
    newArr.push('Game Over');  
  }

  const getCurrPlayerState = () => {
    return tempPlayerState ? tempPlayerState : playerState;
  }

  const getCurrStackState = () => {
    return tempStackState ? tempStackState : stackState;
  }

  const getCurrGarbageState = () => {
    return tempGarbageState ? tempGarbageState : garbageState;
  }

  const getStackTop = (currStackState) => {
    let stackTop = currStackState[currStackState.length-1];
    let counter = 2;
    while (stackTop === 'M') {
      stackTop = currStackState[currStackState.length-counter];
      counter++;
    }
    return stackTop;
  }

  /**
   * Returns an updatedPlayers array wth the turn order and card arrays updated for the next turn.
   *
   * @param {Object[]} currPlayerState - The currently used playerState.
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {Object[]} cardArr - The activePlayer's hand/face-down or face-up arrays.
   * @param {Object[]} newArr - The card array that should replace the old cardArr.
   * @return {Object[]} An updated PlayerState array.
   */
  const getUpdatedPlayersFinish = (currPlayerState, playerInd, cardArr, newArr) => {
    const updatedPlayers = currPlayerState.map((player, index) => {
      if (index !== playerInd) {
        player.turn--;
      } else {
        player.turn = currPlayerState.length;
        player.canFinish = false;
        player[cardArr] = newArr;
      }
      return player;
    })
    return updatedPlayers;
  }

  /**
   * Returns an updatedPlayers array that does NOT update the turn order, as the Active Player can still continue with their turn.
   *
   * @param {Object[]} currPlayerState - The currently used playerState.
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {Object[]} cardArr - The activePlayer's hand/face-down or face-up arrays.
   * @param {Object[]} newArr - The card array that should replace the old cardArr.
   * @return {Object[]} An updated PlayerState array.
   */
  const getUpdatedPlayersContinue = (currPlayerState, playerInd, cardArr, newArr) => {
    const updatedPlayers = currPlayerState.map((player, index) => {
      if (index === playerInd) {
        player.canFinish = true;
        player[cardArr] = newArr;
      }
      return player;
    })
    return updatedPlayers;
  }



    /* ------ The ActivePlayer handlers ------ */

  /**
   * Handles the mechanics of the active user clicking on a card belonging to the active card array (hand or face-up);
   *
   * @param {boolean} active - Whether the given card array is active.
   * @param {string|number} card - The value of the card that was clicked.
   * @param {number} cardInd - The index of the card clicked.
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} gameKey - The id of the active game.
   * @param {string} cardArr - The name of the given card array of which the card was clicked.
   */
  const activeCardArrHandler = (active, card, cardInd, playerInd, gameKey, cardArr) => {
    if (active) {
      const currPlayerState = getCurrPlayerState();
      const currStackState = getCurrStackState();
      const currGarbageState = getCurrGarbageState();
      const stackTop = getStackTop(currStackState);
                
      if (card !== 'C') {
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          const newArr= [...currPlayerState[playerInd][cardArr]];
          newArr.splice(cardInd, 1);
          
          if (newArr.length < 1 && currPlayerState[playerInd].faceDown[0] === 'end') { 
            gameOver(newArr);
          } else {
            if (newArr.length < 1) { newArr.push('end')}
            const oldStack = [...currStackState];            
            if (newArr.indexOf(card) === -1) {
              // Action if card has NO multiples in cardArr
              const updatedPlayers = getUpdatedPlayersFinish(currPlayerState, playerInd, cardArr, newArr);    
              props.firebase.updateStack(gameKey, [...oldStack, card]);
              props.firebase.updatePlayerData(gameKey, updatedPlayers);
              setTempStackState(null);
              setTempPlayerState(null);
            } else {
              // Action if card has multiples in cardArr
              const updatedPlayers = getUpdatedPlayersContinue(currPlayerState, playerInd, cardArr, newArr);
              setTempStackState([...oldStack, card]);
              setTempPlayerState(updatedPlayers);
            }
            // Additional actions if card is 9.                        
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
          gameOver(newArr);
        } else {
          if (newArr.length < 1) { newArr.push('end')}
          if (newArr.indexOf(card) === -1) {
            const updatedPlayers = getUpdatedPlayersFinish(currPlayerState, playerInd, cardArr, newArr);
            props.firebase.updateGarbage(gameKey, [...currStackState, card])
            props.firebase.updateStack(gameKey, ['end']);
            props.firebase.updatePlayerData(gameKey, updatedPlayers);
            setTempGarbageState(null);
            setTempStackState(null);
            setTempPlayerState(null);
          } else {
            const updatedPlayers = getUpdatedPlayersContinue(currPlayerState, playerInd, cardArr, newArr);
            setTempGarbageState([...currStackState, card]);
            setTempStackState(['end']);
            setTempPlayerState(updatedPlayers);
          }         
        }
      }  
    }
  }

  /**
   * Handles the mechanics of the active user clicking on a card belonging to the face-down card array.
   *
   * @param {boolean} active - Whether the face down card array is active.
   * @param {string|number} card - The value of the card that was clicked.
   * @param {number} cardInd - The index of the card clicked.
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} gameKey - The id of the active game.
   */
  const activefaceDownHandler = (active, card, cardInd, playerInd, gameKey) => {
    if (active) {

      let actionTaken = false;
      
      if (card !== 'C') {
        const stackTop = getStackTop(stackState);
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          actionTaken = true;
          const newFaceDown= [...playerState[playerInd].faceDown];
          newFaceDown.splice(cardInd, 1);
          if (newFaceDown.length < 1) { 
            gameOver(newFaceDown);
          } else {
            const updatedPlayers = getUpdatedPlayersFinish(playerState, playerInd, 'faceDown', newFaceDown);           
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
          gameOver(newFaceDown);
        } else {
          const updatedPlayers = getUpdatedPlayersFinish(playerState, playerInd, 'faceDown', newFaceDown); 
          props.firebase.updateGarbage(gameKey, [...stackState, card])
          props.firebase.updateStack(gameKey, ['end']);
          props.firebase.updatePlayerData(gameKey, updatedPlayers);
        }
      }

      if (!actionTaken) {
        let newHand= [...playerState[playerInd].hand];
        if (stackState.length > 1) {
          newHand = stackState.slice(1);
          newHand.push(card);
          props.firebase.updateStack(gameKey, ['end']);
        }
        const newFaceDown= [...playerState[playerInd].faceDown];
        newFaceDown.splice(cardInd, 1);
        if (newFaceDown.length < 1) { newFaceDown.push('end')}
        const updatedPlayers = playerState.map((player, index) => {
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

  /**
   * Handles the mechanics of the active user clicking on the "Take Stack" button.
   *
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} gameKey - The id of the active game.
   */
  const takeStackHandler = (playerInd, gameKey) => {
    
    const currPlayerState = getCurrPlayerState();
    const currStackState = getCurrStackState();
    const currGarbageState = getCurrGarbageState();
    
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
    const updatedPlayers = getUpdatedPlayersFinish(currPlayerState, playerInd, 'hand', newHand);
    props.firebase.updateGarbage(gameKey, currGarbageState);
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
    setTempGarbageState(null);
    setTempPlayerState(null);
  }

  /**
   * Handles the mechanics of the active user clicking on the "Finish Turn" button once at least one card has been played. Note: The player, stack and garbage state are all updated regardless of the stack being present, due to a potential situation of a card (which had a multiple in the same array) being played by the active player before the "take stack" button was clicked - a rare situation, but possible.
   *
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} gameKey - The id of the active game.
   */
  const finishTurnHandler = (playerInd, gameKey) => {
    
    const currPlayerState = getCurrPlayerState();
    const currStackState = getCurrStackState();
    const currGarbageState = getCurrGarbageState();
    
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