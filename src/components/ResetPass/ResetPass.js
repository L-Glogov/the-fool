import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import styles from './ResetPass.module.css';

const ResetPass = ( props ) => {
  
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    props.firebase.resetUserPassword(email)
    .then(()=> {
      setEmail('');
      props.history.push('/signin');
    })
    .catch(error => {
      console.error(error);
      alert(error.message);
    })
    
    e.preventDefault();
  }

  const isInvalid = email === "";

  return (
    <main className={styles.main}>
      <h1>Reset Password</h1>
      <Link to="/main-menu" className='home'><i className="fas fa-home"></i></Link>
      <form onSubmit={onSubmit} className={styles.container}>
        <label htmlFor="email">E-mail: </label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="peasant@mail.com"
        />
        <button type="submit" disabled={isInvalid}>Click to receive reset password email</button>
      </form>
    </main>
  );  
}

ResetPass.propTypes = {
  firebase: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(withFirebase(ResetPass)); 