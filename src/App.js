import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import logo from './svg/sade_innovations_on_black_background.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import {Auth} from 'aws-amplify';
import '@aws-amplify/ui/dist/style.css';


import Home from "./pages/Home";
import UsersData from "./pages/UsersData";
import TopicsData from "./pages/TopicsData";
import TodoData from "./pages/TodoData";
import MeetingsList from "./pages/MeetingsList";

const pageHome='/';
const pageUsers='/users'
const pageTopics='/topics'
const pageTodos='/todos';
const pageMeetings='/meetings';


export function signOut() {
    console.log("Signing out");
    Auth.signOut();
  }

export function generateId() {
    return uuidv4();
}


const mtg = {
    id : "",
    name : "",
    description : ''
}

export function setSelectedMeeting(id, name, description) {
    mtg.id=id;
    mtg.name=name;
    mtg.description=description;
    console.log("SELECTED MTG", mtg.id, mtg.name, mtg.description);
}

  
/**
 * Class App
 * - Main router page
 */
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toPage: pageHome,
            showWait: false,
        }

        this.goPage = this.goPage.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goUsers = this.goUsers.bind(this);
        this.goTopics = this.goTopics.bind(this);
        this.goTodos = this.goTodos.bind(this);
        this.goMeetings = this.goMeetings.bind(this);

    }

    goPage(page) {
        console.log("Go Page '",page,"'");
        this.setState({ 
            toPage: page,
            showWait: true
        });
    }

    goHome() {
        this.goPage(pageHome)
    }

    goUsers() {
        this.goPage(pageUsers)
    }

    goTopics() {
        this.goPage(pageTopics)
    }

    goTodos() {
        this.goPage(pageTodos)
    }
    
    goMeetings() {
        this.goPage(pageMeetings)
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
                        <button style={styles.button} onClick={this.goHome}>Home</button>
                        <hr/>
                        <button style={styles.button} onClick={this.goUsers}>Users</button>
                        <button style={styles.button} onClick={this.goTopics}>Topics</button>
                        <button style={styles.button} onClick={this.goTodos}>Todos</button>
                        <hr/>
                        <button style={styles.button} onClick={this.goMeetings}>Meetings</button> 
                        <hr/>
                        <button style={styles.button} onClick={() => signOut()}>Sign out</button>  
                        <p/>
                    </div>  
                    <div style={styles.container}>
                        <div style={styles.status}>
                            { 
                            mtg.id 
                                ? <div> Selected meeting: { mtg.name } ({ mtg.id }) </div> 
                                : <div></div>
                            } 
                        </div>
                        <BrowserRouter>
                            <div>
                                {
                                this.showWait 
                                    ? <div style = {styles.info}> Loading... </div>
                                    : <div></div>
                                } 
                                <Redirect to= {this.state.toPage} />
                                <Switch>
                                    <Route exact path={pageHome} component={Home} />
                                    <Route path={pageUsers} component={UsersData} />
                                    <Route path={pageTopics} component={TopicsData} />
                                    <Route path={pageTodos} component={TodoData} />
                                    <Route path={pageMeetings} component={MeetingsList} />
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
    container: { width: 500, margin: '0 auto', justifyContent: 'center', padding: 10 },
 //   container: { width: 500, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    status: { color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 10, padding: '4px 4px' }
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

