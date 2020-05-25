import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from './Player.module.css';

const Player = ( props ) => {

  const faceUpCards = props.faceUp.map(card => {
    if (card === 'end') {
      return <p key={uuidv4()}></p>
    }
    return (
      <li key={uuidv4()} className={'card' + card}></li>
    )
  })

  const faceDownCards = props.faceDown.map(card => {
    if (card === 'end') {
      return <p key={uuidv4()}>No cards left face-down.</p>
    }
    return (
      <li key={uuidv4()} className='cardback'></li>
    )
  })

  let playerClass;
  switch (props.playerDispClass) {
    case 'first':
      playerClass = styles.first;
      break;
  
    case 'second':
      playerClass = styles.second;
      break;

    case 'third':
      playerClass = styles.third;
      break;

    default:
      break;
  }

  return (
    <div className={playerClass}>
      <div className={styles.namehand}>
        <p className='namefontsize'>{props.name}</p>
        <p>Cards in hand: {props.hand[0] !== 'end' ? props.hand.length : 'none'}</p>
      </div>    
      <ul className={styles.faceup}>
        {faceUpCards}
      </ul>
      <ul className={styles.facedown}>
        {faceDownCards}
      </ul>    
    </div>
  )
}

Player.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  turn: PropTypes.number.isRequired,
  hand: PropTypes.array,
  faceDown: PropTypes.array.isRequired,
  faceUp: PropTypes.array.isRequired,
  playerDispClass: PropTypes.string.isRequired
}

export default Player;