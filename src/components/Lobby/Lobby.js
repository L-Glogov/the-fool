import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styles from './Lobby.module.css';

const Lobby = ( props ) => {


  
  return (
    <main>
      <div>
        <Link to="/gameboard" onClick={props.start}>Start Game</Link>
        <Link to="/main-menu">Go back to Main Menu</Link>
      </div>
      <div>
        <h3>Players: 1/4</h3>
         {/*Player List */}
      </div>
    </main>
  );
}

Lobby.propTypes = {
  start: PropTypes.func.isRequired,

}

export default Lobby;