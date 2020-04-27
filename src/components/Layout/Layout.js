import React from 'react';
import SignOut from '../SignOut/SignOut';
import PropTypes from 'prop-types';
// import styles from './Layout.module.css';

const Layout = ( props ) => {

  return (
    <div>
      <h1>The Fool</h1>
      {props.signedIn && <SignOut />}
      <nav>
        <ul>

        </ul>
      </nav>
      {props.children}
      <footer>
        <p>&copy; {new Date().getFullYear()} L-Glogov, No Rights Reserved</p>
      </footer>
    </div>
  )
  
}

Layout.propTypes = {
  signedIn: PropTypes.object,
  children: PropTypes.object.isRequired
}

export default Layout;