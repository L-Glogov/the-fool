import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const ActivePlayer = ( props ) => {

  const handCards = props.hand.map(card => {
    return (
      <li key={uuidv4()}>{card}</li>
    )
  })

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
      <p>{props.name} (Me)</p>
      <ul>
        {handCards}
      </ul>
      <ul>
        {faceUpCards}
      </ul>
      <ul>
        {faceDownCards}
      </ul>
    </div>
  )
}

ActivePlayer.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  turn: PropTypes.number.isRequired,
  hand: PropTypes.array.isRequired,
  faceDown: PropTypes.array.isRequired,
  faceUp: PropTypes.array.isRequired
}

export default ActivePlayer ;