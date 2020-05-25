import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from './ActivePlayer.module.css';
import HandCards from '../HandCards/HandCards';

const ActivePlayer = ( props ) => {

  const [showHand, setShowHand] = useState(false);

  const handActive = props.turn === 1;
  const faceUpActive = handActive && props.hand[0] === "end";
  const faceUpHoverClass = faceUpActive ? ' active' : '';
  const faceUpCards = props.faceUp.map((card, index) => {
    if (card === 'end') {
      return <p key={uuidv4()}></p>
    }
    return (
      <li key={uuidv4()} className={'card' + card + faceUpHoverClass} onClick={() => props.activeCards(faceUpActive, card, index, props.playerInd, props.name, props.gameId, 'faceUp')}></li>
    )
  })

  const faceDownActive = faceUpActive && props.faceUp[0] === "end";
  const faceDownHoverClass = faceDownActive ? ' active' : '';
  const faceDownCards = props.faceDown.map((card, index) => {
    if (card === 'end') {
      return <p key={uuidv4()}>No cards left face-down.</p>
    }
    return (
      <li key={uuidv4()} className={'cardback' + faceDownHoverClass} onClick={() => props.activeFaceDown(faceDownActive, card, index, props.playerInd, props.name, props.gameId)}></li>
    )
  })
  
  return (
    <div className={styles.container}>
      <div className={styles.turn}>
        <p className='namefontsize'>{props.name} (Me)</p>
        {props.turn === 1 && <p>It is your turn!</p>}
      </div>
      {showHand && <div>
        <HandCards 
          handActive={handActive}
          hand={props.hand}
          gameId={props.gameId}
          activeCards={props.activeCards}
          playerInd={props.playerInd}
          name={props.name}
          showHand={setShowHand}
        />
      </div>}
      <div className={styles.faceup}>
        <ul>
          {faceUpCards}
        </ul>
      </div>
      <div className={styles.facedown}>
        <ul>
          {faceDownCards}
        </ul>
      </div>
      <div className={styles.options}>
        <button onClick={() => setShowHand(true)}>Hand Cards</button>
        {props.turn === 1 && <button onClick={() => props.takeStack(props.playerInd, props.name, props.gameId)}>Take stack</button>}
        {props.canFinish && <button onClick={() => props.finishTurn(props.playerInd, props.gameId)}>Finish Turn</button>}
      </div>
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