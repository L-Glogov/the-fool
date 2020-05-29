import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';
import Player from '../Player/Player';
import ActivePlayer from '../ActivePlayer/ActivePlayer';
import styles from './GameBoard.module.css';
import GameLog from '../GameLog/GameLog';

const GameBoard = ( props ) => {

  const gameIndex = props.gameList.findIndex(item => item.id === props.current.id);
  const gameId = props.gameList[gameIndex].id;
  const [playerState, setPlayerState] = useState([]);
  const [stackState, setStackState] = useState([]);
  const [garbageState, setGarbageState] = useState([]);
  const [logState, setLogState] = useState([]);

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
      setLogState(data[gameId].log);
    });
  }, [props.firebase, setPlayerState, setStackState, setGarbageState, setLogState, gameId]);


  /* -----Utility functions ------ */

  const getStackTop = () => {
    let stackTop = stackState[stackState.length-1];
    let counter = 2;
    while (stackTop === 'M') {
      stackTop = stackState[stackState.length-counter];
      counter++;
    }
    return stackTop;
  }

  /**
   * Returns an updatedPlayers array wth the turn order and card arrays updated for the next turn.
   *
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {Object[]} cardArr - The activePlayer's hand/face-down or face-up arrays.
   * @param {Object[]} newArr - The card array that should replace the old cardArr.
   * @return {Object[]} An updated playerState array.
   */
  const getUpdatedPlayersFinish = (playerInd, cardArr, newArr) => {
    const updatedPlayers = playerState.map((player, index) => {
      if (index !== playerInd) {
        player.turn--;
      } else {
        player.turn = playerState.length;
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
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {Object[]} cardArr - The activePlayer's hand/face-down or face-up arrays.
   * @param {Object[]} newArr - The card array that should replace the old cardArr.
   * @return {Object[]} An updated playerState array.
   */
  const getUpdatedPlayersContinue = (playerInd, cardArr, newArr) => {
    const updatedPlayers = playerState.map((player, index) => {
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
   * @param {string} playerName - The name of the active player.
   * @param {string} gameKey - The id of the active game.
   * @param {string} cardArr - The name of the given card array of which the card was clicked.
   */
  const activeCardArrHandler = (active, card, cardInd, playerInd, playerName, gameKey, cardArr) => {
    
    const playingMultiple = playerState[playerInd].canFinish 
      ? card === stackState[stackState.length-1]
      : true;

    if (active && playingMultiple) {
      const stackTop = getStackTop();              
      if (card !== 'C') {
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          const newArr= [...playerState[playerInd][cardArr]];
          newArr.splice(cardInd, 1);
          
          if (newArr.length < 1 && playerState[playerInd].faceDown[0] === 'end') { 
            props.setWinner(gameKey, playerState[playerInd].name);
          } else {
            if (newArr.length < 1) { newArr.push('end')}
            const oldStack = [...stackState];
            const oldLog = [...logState];            
            if (newArr.indexOf(card) === -1) {
              // Action if card has NO multiples in cardArr
              const updatedPlayers = getUpdatedPlayersFinish(playerInd, cardArr, newArr);    
              props.firebase.updateStack(gameKey, [...oldStack, card]);
              props.firebase.updateLog(gameKey, [...oldLog, {
                name: playerName,
                card
              }]);
              props.firebase.updatePlayerData(gameKey, updatedPlayers);
            } else {
              // Action if card has multiples in cardArr
              const updatedPlayers = getUpdatedPlayersContinue(playerInd, cardArr, newArr);
              setStackState([...oldStack, card]);
              setPlayerState(updatedPlayers);
              setLogState([...oldLog, {
                name: playerName,
                card
              }]);
            }
            // Additional actions if card is 9.                        
            if (card === 9 && garbageState.length > 1) {
              const resInd = Math.floor(Math.random() * garbageState.length -1 ) + 1;
              const resurrect = garbageState[resInd];
              if (resurrect === "C") {
                const newGarbage = [...garbageState, ...oldStack.slice(1)];
                props.firebase.updateStack(gameKey, ['end']);
                props.firebase.updateGarbage(gameKey, newGarbage);
                props.firebase.updateLog(gameKey, [...oldLog, {
                  name: 'bishopcard',
                  player: playerName,
                  card: resurrect
                  }]);           
              } else {
                let newGarbage = [...garbageState];
                newGarbage.splice(resInd, 1);
                props.firebase.updateStack(gameKey, [...oldStack, card, resurrect]);
                props.firebase.updateGarbage(gameKey, newGarbage);
                props.firebase.updateLog(gameKey, [...oldLog, {
                  name: 'bishopcard',
                  player: playerName,
                  card: resurrect
                }]);            
              }
            }
          } 
        }
      }
      
      if (card === 'C') {
        const newArr = [...playerState[playerInd][cardArr]];
        newArr.splice(cardInd, 1);
        if (newArr.length < 1 && playerState[playerInd].faceDown[0] === 'end') { 
          props.setWinner(gameKey, playerState[playerInd].name);
        } else {
          if (newArr.length < 1) { newArr.push('end')}
          const oldLog = [...logState];  
          const updatedPlayers = getUpdatedPlayersFinish(playerInd, cardArr, newArr);
          props.firebase.updateGarbage(gameKey, [...stackState, card])
          props.firebase.updateStack(gameKey, ['end']);
          props.firebase.updateLog(gameKey, [...oldLog, {
            name: playerName,
            card
          }]);
          props.firebase.updatePlayerData(gameKey, updatedPlayers);  
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
   * @param {string} playerName - The name of the active player.
   * @param {string} gameKey - The id of the active game.
   */
  const activefaceDownHandler = (active, card, cardInd, playerInd, playerName, gameKey) => {
    if (active) {

      let actionTaken = false;
      
      if (card !== 'C') {
        const stackTop = getStackTop();
        if (card >= stackTop || stackTop === 'end' || card === 1 || card === 'M') {
          actionTaken = true;
          const newFaceDown= [...playerState[playerInd].faceDown];
          newFaceDown.splice(cardInd, 1);
          if (newFaceDown.length < 1) { 
            props.setWinner(gameKey, playerState[playerInd].name);
          } else {
            const updatedPlayers = getUpdatedPlayersFinish(playerInd, 'faceDown', newFaceDown);           
            const oldStack = [...stackState];
            const oldLog = [...logState];
            props.firebase.updateStack(gameKey, [...oldStack, card]);
            props.firebase.updateLog(gameKey, [...oldLog, {
              name: playerName,
              card
            }]);
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
              props.firebase.updateLog(gameKey, [...oldLog, {
                name: 'bishopcard',
                player: playerName,
                card: resurrect
              }]);
            }
          }       
        }
      }
      
      if (card === 'C') {
        actionTaken = true;
        const newFaceDown= [...playerState[playerInd].faceDown];
        newFaceDown.splice(cardInd, 1);
        if (newFaceDown.length < 1) { 
          props.setWinner(gameKey, playerState[playerInd].name);
        } else {
          const updatedPlayers = getUpdatedPlayersFinish(playerInd, 'faceDown', newFaceDown); 
          props.firebase.updateGarbage(gameKey, [...stackState, card])
          props.firebase.updateStack(gameKey, ['end']);
          props.firebase.updateLog(gameKey, [...logState, {
            name: playerName,
            card
          }]);
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
        props.firebase.updateLog(gameKey, [...logState, {
          name: 'takesstack',
          card: null,
          player: playerName
        }]);
        props.firebase.updatePlayerData(gameKey, updatedPlayers);
      }
    }
  }

  /**
   * Handles the mechanics of the active user clicking on the "Take Stack" button.
   *
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} playerName - The name of the active player.
   * @param {string} gameKey - The id of the active game.
   */
  const takeStackHandler = (playerInd, playerName, gameKey) => {
    
    let newHand = [...playerState[playerInd].hand];
    if (stackState.length > 1) {
      const prevStackCards = stackState.slice(1);     
      if (newHand[0] === 'end') {
        newHand = prevStackCards;
      } else {
        newHand.push(...prevStackCards);
      }
      props.firebase.updateStack(gameKey, ['end']);
    } else {
      props.firebase.updateStack(gameKey, stackState);
    }
    const updatedPlayers = getUpdatedPlayersFinish(playerInd, 'hand', newHand);
    props.firebase.updateLog(gameKey, [...logState, {
      name: 'takesstack',
      card: null,
      player: playerName
    }]);
    props.firebase.updateGarbage(gameKey, garbageState);
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
  }

  /**
   * Handles the mechanics of the active user clicking on the "Finish Turn" button once at least one card has been played. Note: The player, stack and garbage state are all updated regardless of the stack being present, due to a potential situation of a card (which had a multiple in the same array) being played by the active player before the "take stack" button was clicked - a rare situation, but possible.
   *
   * @param {number} playerInd - The index of the active player in the playerState array.
   * @param {string} gameKey - The id of the active game.
   */
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
    props.firebase.updateGarbage(gameKey, garbageState);
    props.firebase.updateStack(gameKey, stackState);
    props.firebase.updatePlayerData(gameKey, updatedPlayers);
    props.firebase.updateLog(gameKey, logState); 
  }

  const playerDispClasses = ['first', 'second', 'third'];
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
    const playerDispClass = playerDispClasses.shift();
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
        playerDispClass={playerDispClass}
      />
    )
  })

  const turnOrder = [...playerState].sort((a, b) => {
    return a.turn - b.turn
  }).map( item => {
    return (
      <li key={item.id}>{item.name}</li>
    )
  })

  const currentTurn = [...playerState].filter(item => {
    return item.turn === 1;
  }).map(item => {
    return item.name;
  })

  const stackLength = stackState.length - 1;
  const garbageLength = garbageState.length - 1;
  const stackTop = getStackTop();

  return (
    <main className={styles.main}>
      <Link to="/main-menu" className='home'><i className="fas fa-home"></i></Link> 
      {props.gameList[gameIndex].winner.won ? <h2>{props.gameList[gameIndex].winner.name} won!</h2> : <div>
        {players}
        <div className={'card' + stackTop}></div>  
      </div>}
      <div className={styles.info}>
        <h3>Current Turn: {currentTurn}</h3>
        <h3>Turn Order:</h3>
        <ol>
          { turnOrder }
        </ol>
        <h3>Cards in graveyard: {garbageLength}</h3>
        <h3>Cards in stack: {stackLength}</h3>
        <h3>Game Log</h3>
        <GameLog 
          log={logState}
        />
      </div>
    </main>
  );
}

GameBoard.propTypes = {
  current: PropTypes.object.isRequired,
  gameList: PropTypes.array.isRequired,
  firebase: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setWinner: PropTypes.func.isRequired
}

export default withFirebase(GameBoard);