import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const pageInitialState = {
    toPage: pageHome,
}

var topicList = [...''];
var userList = [...''];

export function addTopicToList(id) {
    topicList = [...topicList, id];
    console.log("addTopicToList", id);
}

export function addUserToList(id) {
    userList = [...userList, id];
    console.log("addUserToList", id);
}

const MeetingData = (itemId) => {
    const [meetingState, setMeetingState] = useState(meetingInitialState);
    const [meetings, setMeetings] = useState([]);

    const [pageState, setPageState] = useState(pageInitialState);

    useEffect(() => {
       fetchMeetings()
    }, []);

    if (itemId) {
        preFillForm(itemId, meetings);
    }

    function collectTopics() {
        meetingState.topics = topicList;
        console.log("collectTopics:meetingState.topics", meetingState.topics);
    }

    function collectUsers() {
        meetingState.users = userList;
        console.log("collectUsers:meetingState.users", meetingState.users);
    }
    
    function setInput(key, value) {
        setMeetingState({ ...meetingState, [key]: value })
    }

    function getMeeting(itemId) {
        var mtg = meetingInitialState;

        meetings.forEach(meeting => {
        if (itemId.itemId === meeting.id) {
            console.log("getMeeting: found it!");
            mtg = {...meeting};
        }
        });
        
        return mtg;
    }

    function preFillForm(itemId) {
        const mtg = getMeeting(itemId);
        meetingState.id = mtg.id;
        meetingState.name = mtg.name;
        meetingState.description = mtg.description;
        meetingState.users = mtg.users;
        meetingState.topics = mtg.topics;
        console.log("preFillForm", meetingState);
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
        <button style={styles.button} onClick={goUsers}>Users</button>
        <button style={styles.button} onClick={goTopics}>Topics</button>     
        <div>
            <BrowserRouter>
            <div>
                <Redirect to= {pageState.toPage} />
                <Switch>
                    <Route exact path={pageHome} component={Home} />
                    <Route path={pageUsers} component={UsersData} />
                    <Route path={pageTopics} component={TopicsData} />
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

MeetingData.propTypes = {
    itemId: PropTypes.string,
}

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

