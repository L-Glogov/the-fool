import React from 'react';
import SignOut from '../SignOut/SignOut';
import PropTypes from 'prop-types';
import background from '../../assets/background.jpg';
import styles from './Layout.module.css';

const Layout = ( props ) => {

  const backStyle = {
    minWidth: "100vw",
    minHeight: "100vh",
    backgroundImage: "url(" + background + ")",
    position: "fixed",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    backgroundPositiomn: "center"
  }

  return (
    <div style={backStyle}>
      <div className={styles.heading}>
        <h1>The Fool</h1>
        {props.signedIn && <SignOut />}
      </div>     
      {props.children}
      <footer>
        <p>&copy; {new Date().getFullYear()} L-Glogov</p>
      </footer>
    </div>
  )
  
}

Layout.propTypes = {
  signedIn: PropTypes.object,
  children: PropTypes.object.isRequired
}

export default Layout;