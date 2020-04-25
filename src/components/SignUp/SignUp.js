import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

const SignUp = ( props ) => {
  
  const [username, setUsername] = useState('Peasant');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [confPass, setConfPass] = useState('');

  const onSubmit = (e) => {
    props.firebase.signUpUser(email, password)
    .then(()=> {
      setUsername('Peasant');
      setEmail('');
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
    password === "" ||
    email === "";

  return (
    <main>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username: </label>
        <input 
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Peasant"
          maxLength={8}
        />
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
        <label htmlFor="confpass">Confirm password: </label>
        <input 
          type="password"
          name="confpass"
          value={confPass}
          onChange={(e) => setConfPass(e.target.value)}
          placeholder="Confirm Password"
          minLength={8}
        />
        <button type="submit" disabled={isInvalid}>Sing Up</button>
      </form>
    </main>
  );  
}

SignUp.propTypes = {
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(withFirebase(SignUp)); 