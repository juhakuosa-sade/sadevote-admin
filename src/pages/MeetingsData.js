import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { API, graphqlOperation } from 'aws-amplify'
import { generateId } from '../App'

import Home from "./Home";
import UsersData from "./UsersData";
import TopicsData from "./TopicsData";

import { createMeeting } from '../graphql/mutations'
import { listMeetings } from '../graphql/queries'

const meetingInitialState = { 
    id: generateId(),
    name: '', 
    description: '',
    admins:  [...''],
    users:  [...''],
    topics:  [...'']
}

const pageHome='/';
const pageUsers='/users'
const pageTopics='/topics'
const pageMeetings='/meetings';

const pageInitialState = {
    toPage: pageMeetings,
}

var topicList = [...''];
var userList = [...''];

export function addTopicToList(id) {
    topicList = [...topicList, id];
    console.log("addTopicToList", topicList);
}

export function addUserToList(id) {
    userList = [...userList, id];
    console.log("addUserToList", userList);
}

const MeetingData = () => {
    const [meetingState, setMeetingState] = useState(meetingInitialState);
    const [meetings, setMeetings] = useState([]);

    const [pageState, setPageState] = useState(pageInitialState);

    useEffect(() => {
       fetchMeetings()
    }, []);

    function collectTopics() {
//       meetingState.topics = {...topicList};
        meetingState.topics = topicList;
        console.log("collectTopics:meetingState.topics", meetingState.topics);
    }

    function collectUsers() {
//        meetingState.users = {...userList};
        meetingState.users = userList;
        console.log("collectUsers:meetingState.users", meetingState.users);
    }
    
    function setInput(key, value) {
        setMeetingState({ ...meetingState, [key]: value })
    }

    async function fetchMeetings() {
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings))
            const meetings = meetingData.data.listMeetings.items
            setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
    }

    async function addMeeting() {
        try {
            if (!meetingState.name || !meetingState.description) return
            collectTopics();
            collectUsers();
            const meeting = { ...meetingState };
            setMeetings([...meetings, meeting]);
            clearState();
            await API.graphql(graphqlOperation(createMeeting, {input: meeting}));
        } catch (err) {
            console.log('error creating meeting:', err)
        }
    }

    function clearState() {
        meetingInitialState.id = generateId();
        setMeetingState(meetingInitialState);
        topicList = [...''];
        userList = [...''];
    }
    
    function goPage(page) {
        console.log("Go Page '",page,"'");
        setPageState({ 
            toPage: page
        });
    }

    function goUsers() {
        goPage(pageUsers)
    }

    function goTopics() {
        goPage(pageTopics)
    }

    const meetingsCallback = (id) => {
    //function meetingsCallback(id) {
        // do something with value in parent component, like save to state
        console.log("MeetingsData.meetingsCallback:",id);
    };

    function mytester() {
        console.log("mytester:topicList", topicList);
        console.log("mytester:userList", topicList);
        collectTopics();
        collectUsers();
        console.log("mytester:meeting", meetingState);
        const meeting = { ...meetingState };
        console.log("mytester:meeting", meeting);
    }

return (

    <div style={styles.container}>
        <h3>Meetings</h3>
        <input
            onChange={event => setInput('id', event.target.value)}
            style={styles.inputDisabled}
            value={meetingState.id}
            placeholder="ID"
            disabled={true}
            hidden={false}
        />
        <input
            onChange={event => setInput('name', event.target.value)}
            style={styles.input}
            value={meetingState.name}
            placeholder="Name"
        />
        <input
            onChange={event => setInput('description', event.target.value)}
            style={styles.input}
            value={meetingState.description}
            placeholder="Description"
        />
        <button style={styles.button} onClick={mytester}>Tester</button>
        <button style={styles.button} onClick={goUsers}>Users</button>
        <button style={styles.button} onClick={goTopics}>Topics</button>     
        <div>
            <BrowserRouter>
            <div>
                <Redirect to= {pageState.toPage} />
                <Switch>
                    <Route exact path={pageHome} component={Home} />
                    <Route path={pageUsers} component={UsersData} parentCallback={meetingsCallback} />
                    <Route path={pageTopics} component={TopicsData} parentCallback={meetingsCallback} />
                </Switch>
            </div>
            </BrowserRouter>
        <p/>
        </div>
        <button style={styles.button} onClick={addMeeting}>Create Meeting</button>
       
        {
        meetings.map((meeting, index) => (
            <div key={meeting.id ? meeting.id : index} style={styles.meeting}>
                <p style={styles.meetingName}>{meeting.name}</p>
                <p style={styles.meetingDescription}>{meeting.description}</p>
            </div>
        ))
        }

    </div>
    )
}

/*
class MeetingData extends Component {

    constructor(props) {
        super(props);
        
        this.state = { 
            meetings: [...''],
            
            //meetingState
            id: generateId(),
            name: '', 
            description: '',
            admins:  [...''],
            users:  [...''],
            topics:  [...''],
            
            //pageState
            toPage: pageMeetings,

        };
        this.meetingsCallback = this.meetingsCallback.bind(this);
        
        this.goPage = this.goPage.bind(this);
        this.goUsers = this.goUsers.bind(this);
        this.goTopics = this.goTopics.bind(this);
    };
    
    meetingsCallback = (id) => {
    //function meetingsCallback(id) {
        // do something with value in parent component, like save to state
        console.log("MeetingsData.meetingsCallback:",id);
    };

    goPage(page) {
        console.log("Go Page '",page,"'");
        this.setState({ 
            toPage: page
        });
    };

    goUsers() {
        this.goPage(pageUsers)
    };

    goTopics() {
        this.goPage(pageTopics)
    };

    setInput(key, value) {
        this.setMeetingState({ [key]: value })
    }
    
    setMeetings(meeting) {
        this.setState({ 
            meetings: [...this.state.meetings, meeting]
        });
    }

    setMeetingState({key, value}) {
        this.setState({ [key]: value })
    };

    setPageState({key, value}) {
        this.setState({ [key]: value })
    };

    async fetchMeetings() {
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings))
            const meetings = meetingData.data.listMeetings.items
            this.setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
    };

    async addMeeting() {
        try {
            if (!this.meetingState.name || !this.meetingState.description) return
            const meeting = { ...this.meetingState }
            this.setMeetings([...this.meetings, meeting])
            this.clearState()
            await API.graphql(graphqlOperation(createMeeting, {input: meeting}))
        } catch (err) {
            console.log('error creating meeting:', err)
        }
    };


    clearState() {
        meetingInitialState.id = generateId();
        this.setMeetingState(...meetingInitialState);
    }
    
   render() {
    return (

        <div style={styles.container}>
            <h3>Meetings</h3>
            <input
                onChange={event => this.setInput('id', event.target.value)}
                style={styles.inputDisabled}
                value={this.state.id}
                placeholder="ID"
                disabled={true}
                hidden={false}
            />
            <input
                onChange={event => this.setInput('name', event.target.value)}
                style={styles.input}
                value={this.state.name}
                placeholder="Name"
            />
            <input
                onChange={event => this.setInput('description', event.target.value)}
                style={styles.input}
                value={this.state.description}
                placeholder="Description"
            />
            <button style={styles.button} onClick={this.goUsers}>Users</button>
            <button style={styles.button} onClick={this.goTopics}>Topics</button>     
            <div>
                <BrowserRouter>
                <div>
                    <Redirect to= {this.state.toPage} />
                    <Switch>
                        <Route exact path={pageHome} component={Home} />
                        <Route path={pageUsers} component={UsersData} parentCallback={this.meetingsCallback} />
                        <Route path={pageTopics} component={TopicsData} handleState={this.meetingsCallback} />
                    </Switch>
                </div>
                </BrowserRouter>
            <p/>
            </div>
            <button style={styles.button} onClick={this.addMeeting}>Create Meeting</button>
           
            {
                this.state.meetings.map((meeting, index) => (
                    <div key={meeting.id ? meeting.id : index} style={styles.meeting}>
                        <p style={styles.meetingName}>{meeting.name}</p>
                        <p style={styles.meetingDescription}>{meeting.description}</p>
                    </div>
                ))
            }
    
        </div>
        )
    }
}
*/
const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    meeting: { fontSize: 12, marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 10, padding: 8, fontSize: 12 },
    meetingName: { fontSize: 12, fontWeight: 'bold' },
    meetingDescription: { fontSize: 12, marginBottom: 0 },
    topicDescription: { fontSize: 12, marginLeft: 20 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 0px' }
}

export default MeetingData;

