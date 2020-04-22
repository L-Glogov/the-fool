import React from 'react';
import { Link } from 'react-router-dom';
// import styles from './GameBoard.module.css';

const GameBoard = ( props ) => {

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

export default GameBoard;