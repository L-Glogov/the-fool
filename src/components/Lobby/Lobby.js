import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Lobby.module.css';

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
    readyPlayer[index].ready = !isReady;
    return (
      <li key={item.id}>
        <div className={styles.grid}>
          <p>{isHost && index !== 0 && <button onClick={() => props.updatePlayers(props.gameList[gameIndex].id, withoutPlayer)} className={styles.kick}><i className="fas fa-user-slash"></i></button>}</p>
          <p>{item.name}</p>
          <p>Status: {item.ready ? "Ready": "Not ready"}</p> 
          <p>{isPlayer && <button className={styles.check} onClick={() =>props.updatePlayers(props.gameList[gameIndex].id, readyPlayer)}>{item.ready ? <i className="fas fa-times"></i>: <i className="fas fa-check"></i>}</button>}</p>       
        </div>
      </li>
    )
  })

  let showStart = props.gameList[gameIndex].players.length >= 2 && isHost;
  props.gameList[gameIndex].players.forEach(item => {
    if (item.ready === false) {
      showStart = false;
    }
  })
  
  return (
    <main className={styles.main}>
      <h1>Lobby</h1>
      <Link to="/main-menu" className='home'><i className="fas fa-home"></i></Link> 
      {props.gameList[gameIndex].started && <Redirect to={"/gameboard/" + props.gameList[gameIndex].id} />}
      <div className={styles.container}>
        <div className={styles.start}>         
          <h3 className={styles.players}>Players: {props.gameList[gameIndex].players.length}/4</h3>
          {showStart && <button onClick={() => props.start(props.gameList[gameIndex].id, props.gameList[gameIndex].players)}>Start Game</button>}
        </div>
        <ul>         
          {players}
        </ul>
      </div>
      
    </main>
  );
}

Lobby.propTypes = {
  start: PropTypes.func.isRequired,
  current: PropTypes.object.isRequired,
  gameList: PropTypes.array.isRequired,
  updatePlayers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired

}

export default withRouter(Lobby);