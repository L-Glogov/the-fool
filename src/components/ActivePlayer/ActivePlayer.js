import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const ActivePlayer = ( props ) => {

  const handActive = props.turn === 1;
  let handCards;
  if (props.hand) {
    handCards = props.hand.map((card, index) => {
      if (card === 'end') {
        return <p key={uuidv4()}>No cards left in hand.</p>
      }
      if (card === 'Game Over') {
        return <p key={uuidv4()}>Game Over. You Won!</p>
      }
      return (
        <li key={uuidv4()} onClick={() => props.activeCards(handActive, card, index, props.playerInd, props.gameId, 'hand')}>{card}</li>
      )
    })
  }
   
  const faceUpActive = handActive && props.hand[0] === "end";
  const faceUpCards = props.faceUp.map((card, index) => {
    if (card === 'end') {
      return <p key={uuidv4()}>No cards left face-up.</p>
    }
    return (
      <li key={uuidv4()} onClick={() => props.activeCards(faceUpActive, card, index, props.playerInd, props.gameId, 'faceUp')}>{card}</li>
    )
  })

  const faceDownActive = faceUpActive && props.faceUp[0] === "end";
  const faceDownCards = props.faceDown.map((card, index) => {
    if (card === 'Game Over') {
      return <p key={uuidv4()}>Game Over. You Won!</p>
    }
    return (
      <li key={uuidv4()} card={card} onClick={() => props.activeFaceDown(faceDownActive, card, index, props.playerInd, props.gameId)}>Face down</li>
    )
  })
  
  return (
    <div>
      <h2>{props.name} (Me)</h2>
      {props.turn === 1 && <h3>It is your turn!</h3>}
      <h3>Cards in Hand</h3>
      <ul>
        {handCards}
      </ul>
      <h3>Face Up Cards</h3>
      <ul>
        {faceUpCards}
      </ul>
      <h3>Face Down Cards</h3>
      <ul>
        {faceDownCards}
      </ul>
      {props.turn === 1 && <button onClick={() => props.takeStack(props.playerInd, props.gameId)}>Take stack</button>}
      {props.canFinish && <button onClick={() => props.finishTurn(props.playerInd, props.gameId)}>Finish Turn</button>}
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
  activeCards: PropTypes.func.isRequired,
  activeFaceDown: PropTypes.func.isRequired,
  finishTurn: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  canFinish: PropTypes.bool.isRequired,
  takeStack: PropTypes.func.isRequired
}

export default ActivePlayer ;