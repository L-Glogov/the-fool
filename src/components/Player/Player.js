import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const Player = ( props ) => {

  const faceUpCards = props.faceUp.map(card => {
    if (card === 'end') {
      return <p key={uuidv4()}>No cards left face-up.</p>
    }
    return (
      <li key={uuidv4()}>{card}</li>
    )
  })

  const faceDownCards = props.faceDown.map(card => {
    return (
      <li key={uuidv4()} card={card}>Face down</li>
    )
  })

  return (
    <div>
      <h2>{props.name}</h2>
      <h3>Cards in hand: {props.hand[0] !== 'end' ? props.hand.length : 'none'}</h3>
      <h3>Face Up Cards</h3>
      <ul>
        {faceUpCards}
      </ul>
      <h3>Face Down Cards</h3>
      <ul>
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
  faceUp: PropTypes.array.isRequired
}

export default Player;