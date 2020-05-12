import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import { API, graphqlOperation } from 'aws-amplify'
import { generateId } from '../App'

import { createMeeting, updateMeeting } from '../graphql/mutations'
import { listMeetings } from '../graphql/queries'

export const meetingInitialState = { 
    id: generateId(),
    name: '', 
    description: '',
    admins:  [...''],
    users:  [...''],
    topics:  [...'']
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

var prefill = true;
var useUpdate = false;

const MeetingData = ({itemId, updateMeetingsList}) => {
//const MeetingData = (itemId) => {
    const [meetingState, setMeetingState] = useState(meetingInitialState);
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
       fetchMeetings()
    }, []);

    useEffect(() => { 
        // do after mounting   
            enablePrefill();
            setMeetingState({...meetingInitialState});
        // do before unmounting
        return () => {
            restoreState();
        };
      }, []); // passing empty array means do only once (https://reactjs.org/docs/hooks-effect.html)


    if (itemId) {
        preFillForm(itemId, meetings);
    }

    function restoreState() {
        prefill = true;
        useUpdate=false;
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

    function getMeeting(itemId, meetings) {
        var mtg = {...meetingInitialState};

        meetings.forEach(meeting => {
        if (itemId === meeting.id) {
            console.log("getMeeting: found it!");
            useUpdate=true;
            mtg = {...meeting};
        }
        });
        
        return mtg;
    }

    function preFillForm(itemId) {
        console.log("preFillForm", itemId)

        if (!prefill) {
            console.log("SKIP prefill")
            return
        }
        const mtg = getMeeting(itemId, meetings);
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
            updateMeetingsList();
        } catch (err) {
            console.log('error creating meeting:', err)
        }
    }

    async function updMeeting() {
        try {
            if (!meetingState.name || !meetingState.description) return
            collectTopics();
            collectUsers();
            const meeting = { ...meetingState };
            setMeetings([...meetings, meeting]);
            clearState();
            await API.graphql(graphqlOperation(updateMeeting, {input: meeting}));
            updateMeetingsList();
        } catch (err) {
            console.log('error updating meeting:', err)
        }
    }

    function clearState() {
        meetingInitialState.id = generateId();
        setMeetingState(meetingInitialState);
        topicList = [...''];
        userList = [...''];
    }

    function disablePrefill() {
        prefill = false;
    }

    function enablePrefill() {
        prefill = true;
    }
    
    
return (

    <div style={styles.container}>
        <h3>Meetings</h3>
        <input
            onFocus={disablePrefill}
            onChange={event => setInput('id', event.target.value)}
            style={styles.inputDisabled}
            value={meetingState.id}
            placeholder="ID"
            disabled={true}
            hidden={false}
        />
        <input
            onFocus={disablePrefill}
            onChange={event => setInput('name', event.target.value)}
            style={styles.input}
            value={meetingState.name}
            placeholder="Name"
            disabled={false}
        />
        <input
            onFocus={disablePrefill}
            onChange={event => setInput('description', event.target.value)}
            style={styles.input}
            value={meetingState.description}
            placeholder="Description"
            disabled={false}
        />
        <div>
            <p/>
        </div>       
        {
        useUpdate
        ?
        <button style={styles.button} onClick={updMeeting}>Update Meeting</button>
        :
        <button style={styles.button} onClick={addMeeting}>Create Meeting</button>
        }
    </div>

    )
}

MeetingData.propTypes = {
    itemId: PropTypes.string,
    updateMeetingsList: PropTypes.func,
}

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    meeting: { fontSize: 12, marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 1, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 1, padding: 8, fontSize: 12 },
    meetingName: { fontSize: 12, fontWeight: 'bold' },
    meetingDescription: { fontSize: 12, marginBottom: 0 },
    topicDescription: { fontSize: 12, marginLeft: 20 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 0px' }
}

export default MeetingData;