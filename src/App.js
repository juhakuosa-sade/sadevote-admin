import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import logo from './svg/sade_innovations_on_black_background.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import {Auth} from 'aws-amplify';
import '@aws-amplify/ui/dist/style.css';


import Home from "./pages/Home";
import UsersData from "./pages/UsersData";
import TodoData from "./pages/TodoData";

const pageHome='/';
const pageUsers='/users'
const pageTodos='/todos';


function signOut() {
    console.log("Signing out");
    Auth.signOut();
  }
  
/**
 * Class App
 * - Main router page
 */
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toPage: pageHome
        }

        this.goHome = this.goHome.bind(this);
        this.goTodos = this.goTodos.bind(this);
        this.goUsers = this.goUsers.bind(this);
        this.goPage = this.goPage.bind(this);
    }

    goPage(page) {
        console.log("Go Page '",page,"'");
        this.setState({ 
            toPage: page
        });
    }

    goHome() {
        this.goPage(pageHome)
    }

    goUsers() {
        this.goPage(pageUsers)
    }

    goTodos() {
        this.goPage(pageTodos)
    }
    
    render () {
        
        return (
            <div className="App">
                <header className="App-header">
                    <a href="http://sadeinnovations.com">
                        <img src={logo} className="App-logo" alt="logo"/>
                    </a>
                </header>

                <div className="App-body">

                    <div style={styles.navcontainer}>
                        <button style={styles.button} onClick={() => signOut()}>Sign out</button>
                        <hr/>
                        <button style={styles.button} onClick={this.goHome}>Home</button>
                        <button style={styles.button} onClick={this.goTodos}>Todos</button>
                        <button style={styles.button} onClick={this.goUsers}>Users</button>  <p/>
                    </div>  
                    <div style={styles.container}>
                        
                        <BrowserRouter>
                            <div>
                                
                                <Redirect to= {this.state.toPage} />

                                <Switch>
                                    <Route exact path={pageHome} component={Home} />
                                    <Route path={pageUsers} component={UsersData} />
                                    <Route path={pageTodos} component={TodoData} />
                                </Switch>
                            </div>
                        </BrowserRouter>

                        <p/>

                    </div>

                </div>


            </div>
        );
    }

}

const styles = {
    navcontainer: { backgroundColor: 'grey', width: 100, margin: '0 0', display: 'flex', flexDirection: 'column', justifyContent: 'left', padding: 5 },
    container: { width: 500, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' }
}

export default withAuthenticator(App)



// Get the aws resources configuration parameters
//import awsconfig from './aws-exports'; // if you are using Amplify CLI
//Amplify.configure(awsconfig);

/*
Amplify.configure({
    Auth: {
        // Amazon Cognito Identity Pool ID
        identityPoolId: 'eu-west-1:d6e423e9-b7f4-46ab-9208-e0b400be3c49',
        // Amazon Cognito Region
        region: 'eu-west-1',
        // Amazon Cognito User Pool ID
        userPoolId: 'eu-west-1_fUueFwy5j',
        // Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '6ke2ro39et5if62h2seh4h61vj',
    },
    API: {
        endpoints: [
            {
                name: "sadevoterestapi",
                endpoint: "https://o95m3dpvc1.execute-api.eu-west-1.amazonaws.com/test",
                tableName: "dynamovoter-test",
                region: "eu-west-1",
            }
        ]
    }
});
*/

