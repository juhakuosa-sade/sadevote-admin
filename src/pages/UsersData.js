import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import { API, graphqlOperation } from 'aws-amplify'

import { generateId, getSelectedMeeting } from '../App'

import { createUser, updateUser, updateMeeting } from '../graphql/mutations'
import { listUsers, getMeeting } from '../graphql/queries'

import '../App.css';

const DYNAMO_QUERY_MAX = 1000;

const userInitialState = {
    id: generateId(),
    email: '',
    firstname: '',
    lastname: '',
    shares: '',
    present: false
}

const UsersData = ({itemId, updateUsersList}) => {
    const [formState, setFormState] = useState(userInitialState)
    const [users, setUsers] = useState([])
    const [usePrefill, setUsePrefill] = useState(false);
    const [useUpdate, setUseUpdate] = useState(false);
    const [cbfunc, setCbFunc] = useState(false);

    const selectedMeeting = getSelectedMeeting();

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => { 
        // do after mounting   
            enablePrefill();
            setFormState({...userInitialState});
        // do before unmounting
        return () => {
            restoreState();
        };
    }, []); // passing empty array means do only once (https://reactjs.org/docs/hooks-effect.html)
      
    useEffect(() => {
        if (cbfunc) {
            setTimeout(() => {
                updateUsersList(); 
            }, 1500);
        }
    }, [cbfunc, updateUsersList]);

    useEffect(() => {
        function preFillForm(itemId) {
            var usr = {...userInitialState};
            users.forEach(user => {
            if (itemId === user.id) {
                console.log("preFillForm: found it!");
                setUseUpdate(true);
                usr = {...user};
            }
            });
            
            setFormState({...usr});
        }

        if (usePrefill && itemId) {
            preFillForm(itemId);
        }
    }, [itemId, users, usePrefill]);
 
    function restoreState() {
        setUsePrefill(true);
        setUseUpdate(false);
    }

    async function updateMeetingData(id) {
        let ret = null;
        try {
            const mtg = await API.graphql(graphqlOperation(getMeeting, {id: selectedMeeting.id}));
            let meeting = {...mtg.data.getMeeting}
            const listedUsers = [...meeting.users, id];
            meeting.users = [...listedUsers];
            ret = await API.graphql(graphqlOperation(updateMeeting, {input: meeting}));
        } catch (err) { console.log('error updating meeting:', err) }
        return ret;
    }

    async function fetchUsers() {
        try {
            const userData = await API.graphql(graphqlOperation(listUsers, {limit: DYNAMO_QUERY_MAX}))
            const users = userData.data.listUsers.items
            setUsers(users)
        } catch (err) { console.log('error fetching users') }
    }

    async function addUser() { // 'Create User' button clicked
        let ret = null;
        try {
            if (!formState.id || !formState.email) {
                console.log('error creating user:',formState);
                return ret
            }
            const user = { ...formState }
            if ((user.shares<0) || (user.shares===null) || (user.shares==='')) user.shares = 0;
            
            setUsers([...users, user])
            
            // add the new user to meeting users list for selected meeting
            updateMeetingData(user.id); 
            
            // This will execute the callback and return to UsersList if db operation succeeded
            setCbFunc( ret = await API.graphql(graphqlOperation(createUser, {input: user})));
    
        } catch (err) {
            console.log('error creating user:', err)
        }
        return ret;
    }
    
    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }

    async function updUser() { // 'Update user' button clicked
        let ret = null;
        try {
            if (!formState.id || !formState.email) {
                console.log('error creating user:',formState);
                return ret
            }
            const user = { ...formState }
            setUsers([...users, user]);

            // This will execute the callback and return to UsersList if db operation succeeded
            setCbFunc( ret = await API.graphql(graphqlOperation(updateUser, {input: user})));

        } catch (err) {
            console.log('error updating user:', err)
        }
        return ret;
    }

    function disablePrefill() {
        setUsePrefill(false);
    }

    function enablePrefill() {
        setUsePrefill(true);
    }
    

    return (
        cbfunc ? (
            <div style={styles.info}>
                <p/>
                <div>Loading ...</div>
            </div>
        ) : (  
            <div style={styles.container}>
                <h3>Users</h3>
                <input
                    onFocus={disablePrefill}
                    onChange={event => setInput('id', event.target.value)}
                    style={styles.inputDisabled}
                    value={formState.id}
                    placeholder="ID"
                    disabled={true}
                    hidden={false}
                />
                <input
                    onFocus={disablePrefill}
                    onChange={event => setInput('email', event.target.value)}
                    style={styles.input}
                    value={formState.email}
                    placeholder="Email"
                />
                <input
                    onFocus={disablePrefill}
                    onChange={event => setInput('firstname', event.target.value)}
                    style={styles.input}
                    value={formState.firstname}
                    placeholder="First name"
                />
                <input
                    onFocus={disablePrefill}
                    onChange={event => setInput('lastname', event.target.value)}
                    style={styles.input}
                    value={formState.lastname}
                    placeholder="Last name"
                />
                <input
                    onFocus={disablePrefill}
                    onChange={event => setInput('shares', event.target.value)}
                    style={styles.input}
                    value={formState.shares}
                    placeholder="Shares"
                />
                {
                useUpdate
                ?
                <button style={styles.button} onClick={updUser}>Update User</button>
                :
                <button style={styles.button} onClick={addUser}>Create User</button>
                }
            </div>
        )
    )
}

UsersData.propTypes = {
    itemId: PropTypes.string,
    updateUsersList: PropTypes.func,
}

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 396, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 2 },
    input: { border: 'none', backgroundColor: 'white', marginBottom: 2, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 2, padding: 8, fontSize: 12 },
    userName: { fontSize: 12, fontWeight: 'bold' },
    userDescription: { fontSize: 12, marginBottom: 0 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 2, marginBottom: 8, padding: '12px 0px' },
}


export default UsersData;