import React from 'react';
// import styles from './Layout.module.css';

const Layout = ( props ) => {

  return (
    <div>
      <h1>The Fool</h1>
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

export default Layout;