import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import PropTypes from 'prop-types';

import { generateId } from '../App'
import { addUserToList } from './MeetingsData'

import { createUser } from '../graphql/mutations'
import { listUsers } from '../graphql/queries'
import '../App.css';

const userInitialState = {
    id: generateId(),
    email: '',
    firstname: '',
    lastname: '',
    shares: '',
    present: false
}

const UsersData = ({parentCallback}) => {
    const [formState, setFormState] = useState(userInitialState)
    const [users, setUsers] = useState([])

    /*setFormState({ 
        shares: ''
    });*/

    useEffect(() => {
        fetchUsers()
    }, [])

    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
    }

    function clearState() {
        userInitialState.id = generateId();
        setFormState(userInitialState)
    }

    async function fetchUsers() {
        try {
            const userData = await API.graphql(graphqlOperation(listUsers))
            const users = userData.data.listUsers.items
            setUsers(users)
        } catch (err) { console.log('error fetching users') }
    }

    async function addUser() {
        try {
            if (!formState.id || !formState.email) {
                console.log('error creating user: ID = ',formState.id);
                console.log('error creating user: email = ',formState.email);
                return
            }
            const user = { ...formState }
            if ((user.shares<0) || (user.shares===null) || (user.shares==='')) user.shares = 0;
            console.log('creating user:', user)
            
            setUsers([...users, user])
            await API.graphql(graphqlOperation(createUser, {input: user}))
            
            //console.log("parentCallback", parentCallback);
            //parentCallback(user.id);
            addUserToList(user.id);

            clearState();

        } catch (err) {
            console.log('error creating user:', err)
        }
    }

    function mytester() {
        var userList = ["77bd517b-ec45-4d9e-a9c1-a3da06c7ef06", "669d6fe0-87ce-43bd-ac3c-754b9e79ece8"];
        addUserToList(userList[0]);
        addUserToList(userList[1]);
    }

    return (
        <div style={styles.container}>
            <h3>Users</h3>
            <input
                onChange={event => setInput('id', event.target.value)}
                style={styles.inputDisabled}
                value={formState.id}
                placeholder="ID"
                disabled={true}
                hidden={true}
            />
            <input
                onChange={event => setInput('email', event.target.value)}
                style={styles.input}
                value={formState.email}
                placeholder="Email"
            />
            <input
                onChange={event => setInput('firstname', event.target.value)}
                style={styles.input}
                value={formState.firstname}
                placeholder="First name"
            />
            <input
                onChange={event => setInput('lastname', event.target.value)}
                style={styles.input}
                value={formState.lastname}
                placeholder="Last name"
            />
            <input
                onChange={event => setInput('shares', event.target.value)}
                style={styles.input}
                value={formState.shares}
                placeholder="Shares"
            />
            <button style={styles.button} onClick={mytester}>Tester</button>
            <button style={styles.button} onClick={addUser}>Create User</button>
            {
                users.map((user, index) => (
                    <div key={user.id ? user.id : index} style={styles.user}>
                        <p style={styles.userName}>{user.id} {user.firstname} {user.lastname}</p>
                        <p style={styles.userDescription}>{user.email}</p>
                        <p style={styles.userDescription}>{user.shares} shares </p>
                    </div>
                ))
            }
        </div>
    )
}

UsersData.propTypes = {
    parentCallback: PropTypes.func
};

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    user: {  fontSize: 12, marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 10, padding: 8, fontSize: 12 },
    userName: { fontSize: 12, fontWeight: 'bold' },
    userDescription: { fontSize: 12, marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 0px' }
}

export default UsersData;