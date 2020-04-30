import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const ActivePlayer = ( props ) => {

  const handActive = props.turn === 1;
  let handCards;
  if (props.hand) {
    handCards = props.hand.map((card, index) => {
      return (
        <li key={uuidv4()} onClick={() => props.activeHand(handActive, card, index, props.playerInd, props.gameId)}>{card}</li>
      )
    })
  }
   

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
      {props.turn === 1 && <h3>It is your turn!</h3>}
      <ul>
        {handCards}
      </ul>
      <ul>
        {faceUpCards}
      </ul>
      <ul>
        {faceDownCards}
      </ul>
      {props.canFinish && <button>Finish Turn</button>}
    </div>
  )
}

ActivePlayer.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  playerInd: PropTypes.number.isRequired,
  turn: PropTypes.number.isRequired,
  hand: PropTypes.array,
  faceDown: PropTypes.array.isRequired,
  faceUp: PropTypes.array.isRequired,
  activeHand: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  canFinish: PropTypes.bool.isRequired
}

export default ActivePlayer ;