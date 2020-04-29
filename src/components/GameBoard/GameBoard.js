import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useImmer } from 'use-immer';
import { withFirebase } from '../Firebase';
import Player from '../Player/Player';
import ActivePlayer from '../ActivePlayer/ActivePlayer';
// import styles from './GameBoard.module.css';

const GameBoard = ( props ) => {

  const gameIndex = props.gameList.findIndex(item => item.id === props.current.id);
  const gameId = props.gameList[gameIndex].id;
  const [playerState, setPlayerState] = useImmer([]);
  const [stackState, setStackState] = useState([]);
  const [garbageState, setGarbageState] = useState([]); 

  useEffect(() => {
    props.firebase.playerData().on('value', snapshot => {
      const data = snapshot.val();
      setPlayerState(draft => {
        data[gameId].players.forEach(item => {
          draft.push({
            name: item.name,
            id: item.id,
            turn: item.turn,
            hand: item.hand,
            faceDown: item.faceDown,
            faceUp: item.faceUp
          });
        })
      })
      setStackState(data[gameId].stack);
      setGarbageState(data[gameId].garbage);
    });
  }, [props.firebase, setPlayerState, setStackState, setGarbageState])
  const players = playerState.map(item => {
    if (item.id === props.user.uid) {
      return (
        <ActivePlayer 
          name={item.name}
          key={item.id}
          id={item.id}
          turn={item.turn}
          hand={item.hand}
          faceDown={item.faceDown}
          faceUp={item.faceUp}
        />
      )
    }
    return (
      <Player 
        name={item.name}
        key={item.id}
        id={item.id}
        turn={item.turn}
        hand={item.hand}
        faceDown={item.faceDown}
        faceUp={item.faceUp}
      />
    )
  })


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