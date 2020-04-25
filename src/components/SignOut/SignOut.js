import React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

const SignOut = ( props ) => (
  <button type="button" onClick={props.firebase.signOutUser}></button>
)

SignOut.propTypes = {
  firebase: PropTypes.object.isRequired,
}

export default withFirebase(SignOut);