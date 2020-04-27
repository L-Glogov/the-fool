import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

const ChangePass = ( props ) => {
  
  const [password, setPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const onSubmit = (e) => {
    props.firebase.updateUserPassword(password)
    .then(()=> {
      setPass('');
      setConfPass('');
      props.history.push('/main-menu');
    })
    .catch(error => {
      console.error(error);
      alert(error.message);
    })
    
    e.preventDefault();
  }

  const isInvalid = 
    password !== confPass ||
    password === "";

  return (
    <main>
      <h1>Change Password</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="password">New password: </label>
        <input 
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          minLength={8}
        />
        <label htmlFor="confpass">Confirm password: </label>
        <input 
          type="password"
          name="confpass"
          value={confPass}
          onChange={(e) => setConfPass(e.target.value)}
          placeholder="Confirm Password"
          minLength={8}
        />
        <button type="submit" disabled={isInvalid}>Change Password</button>
      </form>
      <Link to="/main-menu">Go back to Main Menu</Link>
    </main>
  );  
}

ChangePass.propTypes = {
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(withFirebase(ChangePass)); 