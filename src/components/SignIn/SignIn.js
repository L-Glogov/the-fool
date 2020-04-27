import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

const SignIn = ( props ) => {
  
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');

  const onSubmit = (e) => {
    props.firebase.signInUser(email, password)
    .then(() => {
      setEmail('');
      setPass('');
      props.history.push('/main-menu');
    })
    .catch(error => {
      console.error(error);
      alert(error.message);
    })
    
    e.preventDefault();
  }

  const isInvalid = 
    password === "" ||
    email === "";

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">E-mail: </label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="peasant@mail.com"
        />
        <label htmlFor="password">Password: </label>
        <input 
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          minLength={8}
        />
        <button type="submit" disabled={isInvalid}>Sign In</button>
      </form>
      <div>
        <p>Don&apos;t have an account?</p>
        <Link to="/signup">Sign Up!</Link>
      </div>
      <div>
        <p>Forget your password?</p>
        <Link to="/reset-pass">Click here to reset.</Link>
      </div>
      <Link to="/main-menu">Go back to Main Menu</Link> 
    </main>
  );  
}

SignIn.propTypes = {
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(withFirebase(SignIn)); 