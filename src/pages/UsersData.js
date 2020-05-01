import React, { useEffect, useState } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { generateId } from '../App'

import { createUser } from '../graphql/mutations'
import { listUsers } from '../graphql/queries'
import '../App.css';

const userInitialState = {
    id: generateId(),
    email: '',
    firstname: '',
    lastname: '',
    shares: 0,
    present: false
}

const UsersData = () => {
    const [formState, setFormState] = useState(userInitialState)
    const [users, setUsers] = useState([])
    //formState.shares = '';

    useEffect(() => {
        fetchUsers()
        formState.shares = '';
    }, [])

    function setInput(key, value) {
        setFormState({ ...formState, [key]: value })
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
            userInitialState.id = generateId();
            setFormState(userInitialState)
            //formState.shares='';
            await API.graphql(graphqlOperation(createUser, {input: user}))
        } catch (err) {
            console.log('error creating user:', err)
        }
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