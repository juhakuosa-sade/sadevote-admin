import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import { API, graphqlOperation } from 'aws-amplify'
import { generateId } from '../App'

import { createMeeting, updateMeeting } from '../graphql/mutations'
import { listMeetings } from '../graphql/queries'
import { makeMeetingInput } from '../gqlutil'

const DYNAMO_QUERY_MAX = 1000;

export const meetingInitialState = { 
    id: generateId(),
    name: '', 
    description: '',
    admins:  [],
    users:  [],
    topics:  [],
    active: false
}

const MeetingData = ({itemId, updateMeetingsList}) => {
    const [meetingState, setMeetingState] = useState(meetingInitialState);
    const [meetings, setMeetings] = useState([]);
    const [usePrefill, setUsePrefill] = useState(false);
    const [useUpdate, setUseUpdate] = useState(false);

    useEffect(() => {
       fetchMeetings()
    }, []);

    useEffect(() => {             

        // do after mounting   
            setMeetingState({...meetingInitialState});
            enablePrefill();
        // do before unmounting
        return () => {
            restoreState();
        };
      }, []); // passing empty array means do only once (https://reactjs.org/docs/hooks-effect.html)

    useEffect(() => {
        function preFillForm(itemId) {
            console.log("preFillForm", itemId)

            const mtg = meetings.find(item => item.id === itemId);
            if (mtg && (mtg.id === itemId)) {
                setMeetingState(mtg);
                setUseUpdate(true);
            } else {
                setMeetingState({...meetingInitialState});
            }
            
        }

        if (usePrefill && itemId) {
            preFillForm(itemId);
        }
    }, [itemId, meetings, usePrefill]);
 
    function restoreState() {
        setUsePrefill(true);
        setUseUpdate(false);
    }

    function setInput(key, value) {
        setMeetingState({ ...meetingState, [key]: value })
    }

    async function fetchMeetings() {
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings, {limit: DYNAMO_QUERY_MAX}))
            const meetings = meetingData.data.listMeetings.items
            setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
    }

    async function addMeeting() {
        try {
            if (!meetingState.name || !meetingState.description) return
            
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
            
            const meeting = makeMeetingInput({ ...meetingState });
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
    }

    function disablePrefill() {
        setUsePrefill(false);
    }

    function enablePrefill() {
        setUsePrefill(true);
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
    input: { border: 'none', backgroundColor: 'white', marginBottom: 1, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 1, padding: 8, fontSize: 12 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 0px' }
}

export default MeetingData;