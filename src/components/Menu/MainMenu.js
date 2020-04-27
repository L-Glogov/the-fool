import React, { useState } from 'react';
import styles from './MainMenu.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MainMenu = ( props ) => {

  const [ruleGameListDisp, setRuleGameListDisp] = useState('rules');

  const availableGames = props.gameList.map(game => {
    return (
      <li 
        key={game.id} 
        onClick={() => props.setCurrent(draft => {
          draft.id =  game.id;
          draft.host = game.host;
          draft.players = game.players;
        })}
        className={styles.gameListItem}>
        {game.host}&apos;s Game {'\u00a0 \u00a0'} Players:{game.players.length}/4
      </li>
    )
  })

  return (
    <main>
      <div>
        {props.user 
          ? <div>
              <p>You are signed in as {props.user.displayName}</p>
              <Link to="/lobby" onClick={props.join}>Join Game</Link>
              <Link to="/lobby" onClick={props.host}>Host Game</Link>
            </div> 
          : <Link to="/signin">Sign in to start!</Link>
        } 
      </div>
      <div>
        <div>
          <button onClick={() => setRuleGameListDisp('rules')}>Rules</button>
          <button onClick={() => setRuleGameListDisp('gameList')}>Open Games</button>
        </div>
        <div>
          {ruleGameListDisp === 'rules' && 
          <ul>
            <li>You start with 13 cards. 4 cards face down which nobody sees. 4 cards face up which everybody can see and 5 cards in your hand which only you can see.</li>
            <li>On your turn you can play any card (or multiple of the same card), as long as it is higher, or equal to, than the top card of the stack.</li>
            <li>As long as you still have cards in your hand you can only play cards from there. You then play the face up cards - one card at a time.</li>
            <li>After finishing your face up cards, you play your face down cards, picking them blindly.</li>
            <li>If you cannot play any card that is higher, or equal to, the top card of the stack you take the entire stack to your hand. And must now get rid of your hand again to be able to play the face up or face down cards.</li>
            <li>There are 4 types of special cards in the game. The bomb card can be played on any other card and removes the stack completely from the game. The magic card can be played on anything and is invisible, which means only the card underneath is important for the next player. The Baron card adheres to the standard hierarchy rules, but also reverses the turn order. Finally, the fool card can be played over anything, and any card can be played on it.</li>
            <li>It is important to note that even if you have to pick u the stack, you still get to play a card, thus effectively moving that card into your hand if it was face up or face down on the table.</li>
          </ul>}
          {ruleGameListDisp === 'gameList' && 
          <ul>
            {availableGames}
          </ul>}
        </div>
      </div>
    </main>
  );
}

MainMenu.propTypes = {
  gameList: PropTypes.array.isRequired,
  setCurrent: PropTypes.func.isRequired,
  join: PropTypes.func.isRequired,
  host: PropTypes.func.isRequired, 
  user: PropTypes.object
}

export default MainMenu;