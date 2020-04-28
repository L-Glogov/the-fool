import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styles from './Lobby.module.css';

const Lobby = ( props ) => {
  
  const gameIndex = props.gameList.findIndex(item => item.id === props.current.id);
  const isHost = props.gameList[gameIndex].hostId === props.user.uid;
  
  const players = props.gameList[gameIndex].players.map((item, index) => {
    const isPlayer = item.id === props.user.uid;
    const withoutPlayer = [...props.gameList[gameIndex].players];
    withoutPlayer.splice(index, 1);
    const readyPlayer = [];
    props.gameList[gameIndex].players.forEach(item => {  
      readyPlayer.push({
        id: item.id,
        name: item.name,
        ready: item.ready
      })
    })
    const isReady = readyPlayer[index].ready;
    console.log(readyPlayer);
    console.log(!isReady);
    readyPlayer[index].ready = !isReady;
    console.log(readyPlayer);
    return (
      <li key={item.id}>
        {isHost && index !== 0 && <button onClick={() => props.updatePlayers(props.gameList[gameIndex].id, withoutPlayer)}>Kick Player</button>}
        <p>{item.name}</p>
        {isPlayer && <button onClick={() =>props.updatePlayers(props.gameList[gameIndex].id, readyPlayer)}>Ready</button>}
        {item.ready ? <p>Ready</p> : <p>Not ready</p>}
      </li>
    )
  })

  let showStart = props.gameList[gameIndex].players.length >= 2;
  props.gameList[gameIndex].players.forEach(item => {
    if (item.ready === false) {
      showStart = false;
    }
  })

  console.log(showStart);

  return (
    <main>
      <div>
        {showStart && <Link to="/gameboard" onClick={props.start}>Start Game</Link>}
        <Link to="/main-menu">Go back to Main Menu</Link>
      </div>
      <div>
        <h3>Players: {props.gameList[gameIndex].players.length}/4</h3>
         {players}
      </div>
    </main>
  );
}

Lobby.propTypes = {
  start: PropTypes.func.isRequired,
  current: PropTypes.object.isRequired,
  gameList: PropTypes.array.isRequired,
  updatePlayers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired

}

export default Lobby;