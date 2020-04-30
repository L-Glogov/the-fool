import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const Player = ( props ) => {

  const faceUpCards = props.faceUp.map(card => {
    return (
      <li key={uuidv4()}>{card}</li>
    )
  })

  const faceDownCards = props.faceUp.map(card => {
    return (
      <li key={uuidv4()} card={card}>Face down</li>
    )
  })

  return (
    <div>
      <p>{props.name}</p>
      <ul>
        {faceUpCards}
      </ul>
      <ul>
        {faceDownCards}
      </ul>
      <p>Hand: {props.hand ? props.hand.length : 'none'}</p>
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