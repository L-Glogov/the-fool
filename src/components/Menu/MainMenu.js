import React, { useState } from 'react';
import styles from './MainMenu.module.css';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

const MainMenu = ( props ) => {

  const [ruleGameListDisp, setRuleGameListDisp] = useState('rules');

  const availableGames = props.gameList.map(game => {
    const bold = game.id === props.current.id ? 'bold' : 'standard';
    return (
      <li 
        key={game.id} 
        onClick={() => props.setCurrent(draft => {
          draft.id =  game.id;
          draft.hostId = game.hostId;
          draft.host = game.host;
          draft.players = game.players;
          draft.started = game.started;
          draft.winner = game.winner;
        })}
        className={styles.gameListItem + ' ' + bold}>
          <div className={styles.gameitem}>
            <p>{game.host}&apos;s Game {'\u00a0 \u00a0'} </p>
            <p>Players:{game.players.length}/4</p>
            <p>Status: {game.started 
              ? (game.winner.won ? 'Finished' : 'Ongoing' )
              : 'Lobby'}</p>
          </div>
      </li>
    )
  })
  
  let joinOrSpectate = 'Spectate Game';
  if (props.current.players) {
    if (!props.current.started) {
    joinOrSpectate = 'Join Game';
  }
    props.current.players.forEach(item => {
      if (item.id === props.user.uid) {
        joinOrSpectate = 'Join Game';
      }
    })
  }
  

  return (
    <main className={styles.main}>
      <div className={styles.leftcont}>
        {props.user 
          ? <div>
              <p>You are signed in as {props.user.displayName}</p>
              <button onClick={() => props.host(props.history)}>Host Game</button>
              {props.current.id !== null && <button onClick={() => props.join(props.history)}>{joinOrSpectate}</button>}
              {props.current.id !== null && <p className={styles.chosengame}>Chosen game: {props.current.host}&apos;s Game {'\u00a0 \u00a0'}</p>}
            </div> 
          : <Link to="/signin" className={styles.link}>Sign in to start!</Link>
        } 
      </div>
      <div className={styles.rightcont}>
        
        <div className={styles.ruleslist}>
          {ruleGameListDisp === 'rules' && 
          <ul>
            <li>You start with 13 cards. 4 cards face down which nobody sees. 4 cards face up which everybody can see and 5 cards in your hand which only you can see.</li>
            <li>On your turn you can play any card (or multiple of the same card), as long as it is higher, or equal to, than the top card of the stack. The bishop is the only card which cannot be played in multiples.</li>
            <li>As long as you still have cards in your hand you can only play cards from there. You then play the face up cards - one card at a time.</li>
            <li>After finishing your face up cards, you play your face down cards, picking them blindly.</li>
            <li>If you cannot play any card that is higher, or equal to, the top card of the stack you take the entire stack to your hand. And must now get rid of your hand again to be able to play the face up or face down cards.</li>
            <li>There are 4 types of special cards in the game. The bomb card can be played on any other card and removes the stack to the graveyard. The magic card can be played on anything and is invisible, which means only the card underneath is important for the next player. The Bishop card adheres to the standard hierarchy rules, but also resureccts a random card from the graveyard (provided that there are any) and places it at the top of the stack. Finally, the fool card can be played over anything, and any card can be played on it.</li>
          </ul>}
          {ruleGameListDisp === 'gameList' && 
          <ul>
            {availableGames}
          </ul>}     
        </div>
        <div> 
          {ruleGameListDisp === 'gameList' && <button onClick={() => setRuleGameListDisp('rules')}>Rules</button>}
          {ruleGameListDisp === 'rules' && <button onClick={() => setRuleGameListDisp('gameList')}>Open Games</button>}
        </div>
      </div>
    </main>
  );
}

MainMenu.propTypes = {
  gameList: PropTypes.array.isRequired,
  setCurrent: PropTypes.func.isRequired,
  current: PropTypes.object.isRequired,
  join: PropTypes.func.isRequired,
  host: PropTypes.func.isRequired, 
  user: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(MainMenu);