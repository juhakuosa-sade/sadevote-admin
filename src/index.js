import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

/*

// optional configuration
const styles = {
    dialogViewStyle: { height: 300, color: 'black', backgroundColor:'white', display: 'flex', flexDirection: 'column', },
    dialogButtonStyle: { width: 100, color: 'white', backgroundColor:'red', display: 'flex', flexDirection: 'column', },

}
const options = {
    position: positions.MIDDLE,
    timeout: 5000,
    transition: transitions.SCALE
  }
  
  const MyAlertTemplate = ({ messageRow1, messageRow2, close }) => (
    <div style={styles.alertDialogStyle}>
      {messageRow1}
      {messageRow2}
      <button onClick={() => { return true }}>OK</button>
      <button onClick={() => { return false }}>Cancel</button>
</div>
  )
*/
ReactDOM.render(
    <BrowserRouter>
          <App />
      </BrowserRouter>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
