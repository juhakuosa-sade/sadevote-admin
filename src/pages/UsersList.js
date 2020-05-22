import React, { useEffect, useState } from 'react'

import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listUsers } from '../graphql/queries'
import UserData from './UsersData';
import { deleteUser } from '../graphql/mutations'


const initState = {
    renderSelect : "LIST",
    editParam : "",
};

const UsersList = () => {

    /*var listedUsers = [...''];
    export function getListedUsers() {
        return [...listedUsers]
    }*/

    const [users, setUsers] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchUsers();
    }, [])

    function updateFetch() {
        console.log("updateFetch()")
        fetchUsers();
    }
        
    async function fetchUsers() {
        console.log("fetchUsers()")

        setIsLoading(true)
        try {
            const userData = await API.graphql(graphqlOperation(listUsers))
            const users = userData.data.listUsers.items
            // TODO: Add filtering to allow seeing only those items which the admin user has created himself

            setUsers(users)
            listedUsers = [];
            filteredUsers.forEach(element => {
                listedUsers = [...listedUsers, element.id]
            });
        } catch (err) { console.log('error fetching users') }
        setIsLoading(false)
    }

    async function delUser(id)  {
        console.log('deleting user:', id);
        const mtg = {
            id: id,
          };
        try {
            await API.graphql(graphqlOperation(deleteUser, {input: mtg}));
            updateFetch();
        } catch (err) {
            console.log('error deleting user:', err)
        }
        return false;
    }

    async function updateMeetingData(id) {
        const selectedMeeting = getSelectedMeeting();
        let ret = null;
        try {
            const mtg = await API.graphql(graphqlOperation(getMeeting, {id: selectedMeeting.id}));
            let meeting = {...mtg.data.getMeeting}
            const listedUsers = [...meeting.users, id];
            meeting.users = [...listedUsers];
            console.log('updateMeetingData:', meeting)
            ret = await API.graphql(graphqlOperation(updateMeeting, {input: meeting}));
        } catch (err) { console.log('error updating meeting:', err) }
        return ret;
    }

    const driveRendering = ({mode, param}) => {
        /* set some shit to state so that it causes rendering! */
        setState({renderSelect: mode});
        setState({editParam : param});
        console.log("Rendering for", uiState.renderSelect);
    }

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        
        fState.renderSelect="EDIT";
        fState.editParam=id;

        driveRendering("EDIT", id, true);

        console.log("handleEdit:", fState.renderSelect, fState.editParam);
    }
    
    const handleSelect = (event) => {
        const id = event.target.getAttribute('id');
        
        ///updateMeetingData(id);

        fState.renderSelect="SELECT";
        fState.editParam=id;

        driveRendering("SELECT", id, true);

        console.log("handleSelect:", fState.renderSelect, fState.editParam);

    }

    const handleDelete = (event) => {
        let id = event.target.getAttribute('id');

        fState.renderSelect="DELETE";
        fState.editParam=id;

        driveRendering("DELETE", id, true);

        console.log("handleDelete", id);
    }

    const handleCreate = (event) => {

        fState.renderSelect="CREATE";
        fState.editParam='';

        driveRendering("CREATE", '', true);

        console.log("handleCreate:", fState.renderSelect, fState.editParam);
    }
    
    function resetRenderSelection() {
        const param = fState.editParam;
        fState.renderSelect="LIST";
        fState.editParam='';
        return (param);
    }
    
console.log("Rendering", fState.renderSelect);

if (fState.renderSelect === "LIST") {
    return (
        isLoading ? (
            <div style={styles.info}>
                <p/>
                <div>Loading ...</div>
            </div>
        ) : (
            <div style={styles.container}>
                <h3>Users</h3>        
                {
                    users.map((user, index) => (
                        <div key={"divider" + index}>
                        <div key={"containerBox" + index} style={styles.rowcontainer}>
                            <div key={"userItem" + index} style={styles.rowcontainer}>
                                <div key={user.id ? user.id : index}>
                                    <p style={styles.userEmail}>{user.email}</p>
                                    <p style={styles.userData}>{user.firstname} {user.lastname}</p>
                                </div>
                            </div>
                            <button style={styles.button} id={user.id} onClick={handleEdit}>Edit</button>
                            <button style={styles.button} id={user.id} onClick={handleDelete}>Delete</button>
                            <button style={styles.button} id={user.id} onClick={handleSelect}>Select</button>
                        </div>    
                            <hr className="App-horizontal-divider" />
                        </div>
                    ))
                }
                <button style={styles.buttonwide} onClick={handleCreate}>Create new user</button>
            </div>
        )
    )
}

else if (fState.renderSelect === "SELECT") {
    const selected = resetRenderSelection();
    return (
    <div style={styles.container}>
        <h3>User selected:</h3>        
        {
            users.map((user, index) => (
                <div key={user.id ? user.id : index}>
                {
                user.id === selected 
                ? 
                    <div> 
                        <p style={styles.userData}>{user.id}</p>
                        <p/>
                        <p style={styles.userEmail}>{user.email}</p>
                        <p style={styles.userData}>{user.firstname} {user.lastname}</p>
                    </div>   
                : 
                <p/> 
                }                
                </div>
            ))
        }
                
    </div>
    )
}
    

else if (fState.renderSelect === "EDIT") {
    const selected = resetRenderSelection(); 
    return (
    <div style={styles.container}>
        <UserData itemId = {selected} updateUsersList = {updateFetch}/>  
    </div>
    )
}

else if (fState.renderSelect === "DELETE") {
    const selected = resetRenderSelection(); 
    const mtg = delUser(selected);

    var res = "";

    if (!mtg) res= "Deleting user " + selected + " failed.";
    else res = "User " + selected + " deleted.";    
    
    return (
        <h4>{res}</h4>        
    )
}

else /* if (fState.renderSelect === "CREATE") */ {
    resetRenderSelection();
    return (
    <div style={styles.container}>
        <UserData updateUsersList = {updateFetch} />  
    </div>
    )
    
}
}

const styles = {
    container: { width: 500, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 500, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 5 },
    userEmail: { fontSize: 14, fontWeight: 'bold', margin: 0, padding: 0 },
    userData: { fontSize: 12, margin: 0, padding: 0 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    buttonwide: { marginTop: 10, width: 510, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 8px' },
}
export default UsersList;
