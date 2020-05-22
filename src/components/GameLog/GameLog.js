import React from 'react';
import PropTypes from 'prop-types';
import styles from './GameLog.module.css';

const GameLog = ( props ) => {

  const logItems = [...props.log].reverse().map(item => {
    
    let card;
    switch (item.card) {
      case 1:
        card = 'fool';
        break;
      case 2:
        card = 'peasant (2)';
        break;
      case 3:
        card = 'thug (3)';
        break;
      case 4:
        card = 'innkeeper (4)';
        break;
      case 5:
        card = 'merchant (5)';
        break;
      case 6:
        card = 'burgher (6)';
        break;
      case 7:
        card = 'knight (7)';
        break;
      case 8:
        card = 'baron (8)';
        break;
      case 9:
        card = 'bishop (9)';
        break;
      case 10:
        card = 'prince (10)';
        break;
      case 11:
        card = 'king (11)';
        break;
      case 'C':
        card = 'bomb';
        break;
      case 'M':
        card = 'mage';
        break;
      default:
        card = null;
        break;
    }
    
    if (item.name === 'startgame') {
      return (
        <li>Game started!</li>
      )
    } else if (item.name === 'bishopcard') {
      return (
        <li>{item.player} played the bishop card,<br/> which has resurrected the {card}.</li>
      )
    } else if (item.name === 'takesstack') {
      return (
        <li>{item.player} took the stack!</li>
      )
    } else {
      return (
        <li>{item.name} played the {card}.</li>
      )
    }
  })

  return (
    <div className={styles.container}>
      <ol reversed>
        {logItems}
      </ol>
    </div>
  )
  
}

GameLog.propTypes = {
  log: PropTypes.array.isRequired
}

export default GameLog;