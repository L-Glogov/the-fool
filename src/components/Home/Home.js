import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import styles from './Home.module.css';

const Home = ( props ) => {

  return (
    <main className={styles.main}>
      {props.user 
      ? <div className={styles.loggedin}>
          <p>You are signed in as {props.user.displayName}</p>
          <Link className={styles.link} to="/main-menu">Main Menu</Link>  
        </div> 
      : <div className={styles.loggedout}>
          <Link to="/main-menu" className={styles.link}>Main Menu</Link>
          <Link to="/signin" className={styles.link}>Sign In</Link>
          <Link to="/signup" className={styles.link}>Sign Up</Link>
        </div>
      }      
    </main>
  )
  
}

Home.propTypes = {
  user: PropTypes.object
}

export default withRouter(Home);