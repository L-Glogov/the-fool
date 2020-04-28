import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styles from './GameBoard.module.css';

const GameBoard = ( props ) => {

  const gameIndex = props.gameList.findIndex(item => item.id === props.current.id);
  const startingPlayer = Math.floor(Math.random()*props.gameList[gameIndex].players.length);
  useEffect(() => {
    // we must put the card state and everything in the start game button mechanic
  }, [])

  return (
    <main>
      <div>Player 2</div>
      <div>Player 3</div>
      <div>Player 4</div>
      <div>The stack</div>
      <div>Logged in Player</div>
      <Link to="/main-menu">Main Menu</Link>
    </main>
  );
}

GameBoard.propTypes = {
  current: PropTypes.object.isRequired,
  gameList: PropTypes.array.isRequired,
}

export default GameBoard;