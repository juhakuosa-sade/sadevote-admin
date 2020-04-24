import React, { Component } from 'react';
import logo from './svg/sade_innovations_on_black_background.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
import {Auth} from 'aws-amplify';
import '@aws-amplify/ui/dist/style.css';

// Get the aws resources configuration parameters
import awsconfig from './aws-exports'; // if you are using Amplify CLI
Amplify.configure(awsconfig);

function signOut() {
  console.log("Signing out");
  Auth.signOut();
}

class App extends Component {

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <a href="http://sadeinnovations.com">
              <img src={logo} className="App-logo" alt="logo"/>
            </a>
          </header>

          <div className="App-body">

          <button
              onClick={() => signOut()}
          >
            Sign out
          </button>

          </div>

        </div>
    );
  }
}

export default withAuthenticator(App);