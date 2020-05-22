import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import styles from './HandCards.module.css';

const HandCards = ( props ) => {
  const handHoverClass = props.handActive ? ' active' : '';
  let handCards;
  if (props.hand) {
    handCards = props.hand.map((card, index) => {
      if (card === 'end') {
        return <p key={uuidv4()}>No cards left in hand.</p>
      }
      return (
        <li key={uuidv4()} className={'card' + card + handHoverClass} onClick={() => props.activeCards(props.handActive, card, index, props.playerInd, props.name, props.gameId, 'hand')}></li>
      )
    })
  }
  
  return (
    <Fragment>
      <div className={styles.backdrop} onClick={() => props.showHand(false)}></div>
      <div className={styles.modal}>
        <h3>Cards in Hand</h3>
        <ul>
          {handCards}
        </ul>
      </div>     
    </Fragment>
  )
}

HandCards.propTypes = {
  handActive: PropTypes.bool.isRequired,
  playerInd: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  hand: PropTypes.array,
  activeCards: PropTypes.func.isRequired,
  gameId: PropTypes.string.isRequired,
  showHand: PropTypes.func.isRequired
}

export default HandCards;