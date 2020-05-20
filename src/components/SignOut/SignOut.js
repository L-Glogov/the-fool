import React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';
import styles from './SignOut.module.css';

const SignOut = ( props ) => (
  <button type="button" className={styles.signout} onClick={props.firebase.signOutUser}>Sign Out</button>
)

SignOut.propTypes = {
  firebase: PropTypes.object.isRequired,
}

export default withFirebase(SignOut);