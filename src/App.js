import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import logo from './svg/sade_innovations_on_black_background.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import {Auth} from 'aws-amplify';
import '@aws-amplify/ui/dist/style.css';
import { confirmAlert } from 'react-confirm-alert';
import './pages/Alert.css';

import Home from "./pages/Home";
import MeetingsList from "./pages/MeetingsList";
import UsersList from "./pages/UsersList";
import TopicsList from "./pages/TopicsList";
import RunMeeting from "./pages/Execution";
import TodoData from "./pages/TodoData";

export function signOut() {
    console.log("Signing out");
    Auth.signOut();
  }

export function generateId() {
    return uuidv4();
}

export function confirmDelete(row1) {
    return new Promise(function (resolve) {
        confirmAlert({
            title: "You are about to delete " + row1,
            message: "Are you sure?",
            buttons: [
            {
                label: 'Yes',
                onClick: () => { resolve(true) }
            },
            {
                label: 'No',
                onClick: () => { resolve(false) }
            }
            ]
        });
    });
}
export function confirmAction(row1) {
    return new Promise(function (resolve) {
        confirmAlert({
            title: "You are about to " + row1,
            message: "Are you sure?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => { resolve(true) }
                },
                {
                    label: 'No',
                    onClick: () => { resolve(false) }
                }
            ]
        });
    });
}

const pageHome='/';
const pageMeetings='/meetings';
const pageTopics='/topics'
const pageUsers='/users'
const pageRun='/run'
const pageTodos='/todos';

const selectedMeeting = {
    id : "",
    name : "",
    description : '',
    selected: false
}

export function setSelectedMeeting(id, name, description) {
    selectedMeeting.id=id;
    selectedMeeting.name=name;
    selectedMeeting.description=description;
    selectedMeeting.selected=true;

    console.log("SELECTED MTG", selectedMeeting.id, selectedMeeting.name, selectedMeeting.description);
}

export function getSelectedMeeting() {
    return selectedMeeting;
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
            contentButtonsDisabled: true,
            meetingRunning: false
        }

        this.goPage = this.goPage.bind(this);
        this.goHome = this.goHome.bind(this);
        this.goMeetings = this.goMeetings.bind(this);
        this.goTopics = this.goTopics.bind(this);
        this.goUsers = this.goUsers.bind(this);
        this.goRun = this.goRun.bind(this);
        this.goStop = this.goStop.bind(this);
        this.goTodos = this.goTodos.bind(this);

        this.enableContentButtons = this.enableContentButtons.bind(this);
        this.disableContentButtons = this.disableContentButtons.bind(this);
        this.meetingSelected = this.meetingSelected.bind(this);
        this.setMeetingRunning = this.setMeetingRunning.bind(this);

    }

    enableContentButtons() {
        this.setState({ contentButtonsDisabled: false });
    }
    disableContentButtons() {
        this.setState({ contentButtonsDisabled: true });
    }
    setMeetingRunning(running) {
        this.setState({ meetingRunning: running });
    }

    meetingSelected() {
        this.enableContentButtons();
        this.goTopics();
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

    goMeetings() {
        this.goPage(pageMeetings)     
    }

    goTopics() {
        this.goPage(pageTopics)
    }

    goUsers() {
        this.goPage(pageUsers)
    }
 
    goRun() {
        this.disableContentButtons()
        this.setMeetingRunning(true)
        this.goPage(pageRun)
    }

   async goStop() {
        if (await confirmAction("stop the meeting")) {
            this.disableContentButtons()
            this.setMeetingRunning(false)
            this.goPage(pageHome)
            }
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
                        <button style={styles.button}
                                hidden = {!this.state.meetingRunning}
                                onClick={this.goStop}>Stop meeting</button>
                        <button style={styles.button}
                                hidden = {this.state.meetingRunning}
                                onClick={this.goHome}>Home</button>
                        <hr/>
                        <button style={styles.button}
                                hidden = {this.state.meetingRunning}
                                onClick={this.goMeetings}>Meetings</button>
                        <hr/>
                        <button style={styles.button}
                                hidden = {this.state.contentButtonsDisabled}
                                onClick={this.goTopics}>Topics</button>
                        <button style={styles.button}
                                hidden = {this.state.contentButtonsDisabled}
                                onClick={this.goUsers}>Users</button>
                        <button style={styles.button}
                                hidden={true}
                                onClick={this.goTodos}>Todos</button>
                        <hr/>
                        <button style={styles.button}
                                hidden = {this.state.contentButtonsDisabled}
                                onClick={this.goRun}>Run</button>
                        <hr/>
                        <button style={styles.button} onClick={() => signOut()}>Sign out</button>
                        <p/>
                    </div>
                    <div style={styles.container}>
                        <div style={styles.status}>
                            { 
                            selectedMeeting.id 
                                ? 
                                <div> Selected meeting: { selectedMeeting.id } 
                                    <div style={styles.title}>{ selectedMeeting.name }</div>
                                </div>

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
                                    <Route path={pageMeetings} 
                                           component={props => <MeetingsList 
                                           cbfn={this.meetingSelected}/>}/>
                                    <Route path={pageTopics} component={TopicsList} />
                                    <Route path={pageUsers} component={UsersList} />
                                    <Route path={pageRun} component={RunMeeting} />
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
    container: { width: 500, margin: '0 auto', justifyContent: 'center', padding: 10 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    status: { color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    info: { color: 'white', outline: 'none', fontSize: 10, padding: '0px 0px' },
    title: { color: 'white', outline: 'none', fontSize: 18, fontWeight: 'bold' }
}

export default withAuthenticator(App);

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

