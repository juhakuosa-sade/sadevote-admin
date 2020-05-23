import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa';

import { getSelectedMeeting } from '../App'
import { meetingInitialState } from'./MeetingsData';

import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listUsers, getMeeting } from '../graphql/queries'
import UserData from './UsersData';
import { deleteUser, updateMeeting } from '../graphql/mutations'


const initState = {
    renderSelect : "LIST",
    editParam : "",
};

const UsersList = () => {

    const [users, setUsers] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);
    const [isLoading, setIsLoading] = useState(false);
    const [mtgFetchAllowed, setMtgFetchAllowed] = useState(true);
    const [mtgState, setMtgState] = useState();
    const [noMeetingSelected, setNoMeetingSelected] = useState(false);


    const selectedMeeting = getSelectedMeeting();

    useEffect(() => {
        fetchAllUsers();
    }, [])
    
    useEffect(() => {
        async function getMeetingUsers(id) {

            try {
                const mtg = await API.graphql(graphqlOperation(getMeeting, {id: id}));
                const meeting = {...mtg.data.getMeeting}
                setMtgState({...meeting});  
            } catch (error) {
                console.log("Error in getting meeting users ( getMeetingUsers(id) )", error);
                setMtgState({...meetingInitialState}); 
                setNoMeetingSelected(true); 
            }
        }

        if (mtgFetchAllowed) {
            setMtgFetchAllowed(false)
            getMeetingUsers(selectedMeeting.id)
        }

    }, [selectedMeeting.id, mtgFetchAllowed])

    function updateFetch() {
        console.log("updateFetch()")
        fetchAllUsers();
    }
    
    async function fetchAllUsers() {
        console.log("fetchUsers()")

        setIsLoading(true)
        try {
            const userData = await API.graphql(graphqlOperation(listUsers))
            const userIdList = userData.data.listUsers.items
            // TODO: Add filtering to allow seeing only those items which the admin user has created himself

            setUsers(userIdList)
            
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

    async function updateMeetingData() {
        
        let ret = null;
        if (selectedMeeting.id === '') return ret;

        try {
            const meeting = {...mtgState}
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

    function isSelected(id) {
       if (mtgState) {
            const item = mtgState.users.find(item => item === id);     
            console.log("isSelected", id, item)
            if (item === id) return true
        }
        return false      
    }
    
    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        
        fState.renderSelect="EDIT";
        fState.editParam=id;

        driveRendering("EDIT", id);

        console.log("handleEdit:", fState.renderSelect, fState.editParam);
    }

    const handleSelect = (event) => {
        const id = event.target.getAttribute('id');
        
        fState.renderSelect="LIST";
        fState.editParam=id;

        const arr = [...mtgState.users, id]; 
        setMtgState({ ...mtgState, users: [...arr]});
    
        driveRendering("LIST", id);

        console.log("handleSelect:", fState.renderSelect, fState.editParam);

    }

    const handleUnSelect = (event) => {
        const id = event.target.getAttribute('id');
        
        fState.renderSelect="LIST";
        fState.editParam=id;

        const arr = mtgState.users.filter(item => item !== id);     
        setMtgState({ ...mtgState, users: [...arr]});
    
        driveRendering("LIST", id);

        console.log("handleSelect:", fState.renderSelect, fState.editParam);

    }

    const handleUpdateMtg = (event) => {

        updateMeetingData();

        fState.renderSelect="LIST";
        fState.editParam='';

        driveRendering("LIST", '');

        console.log("handleUpdateMtg");
    }

    const handleCreate = (event) => {

        fState.renderSelect="CREATE";
        fState.editParam='';

        driveRendering("CREATE", '');

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
                                {
                                isSelected(user.id)  
                                    ?
                                    <div hidden = {false}>
                                        <FaCheck style={styles.icon} />                               
                                    </div>
                                    :
                                    <div hidden = {true}>
                                        <FaCheck style={styles.icon} />                               
                                    </div>
                                }
                                <div key={user.id ? user.id : index}>
                                    <p style={styles.userEmail}>{user.email}</p>
                                    <p style={styles.userData}>{user.firstname} {user.lastname} ({user.shares} shares)</p>
                                </div>
                                
                            </div>
                            
                            <button style={styles.button} id={user.id} onClick={handleEdit}>Edit</button>
                            
                            {
                            isSelected(user.id)  
                                ?
                                <button hidden={noMeetingSelected} style={styles.button} id={user.id} onClick={handleUnSelect}>Exclude</button>
                                :
                                <button hidden={noMeetingSelected} style={styles.button} id={user.id} onClick={handleSelect}>Include</button>
                            }

                        </div>    
                            <hr className="App-horizontal-divider" />
                        </div>
                    ))
                }
                <button style={styles.buttonwide} onClick={handleCreate}>Create new user</button>

                <button style={styles.buttonwide} onClick={handleUpdateMtg}>Update meeting</button>

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
    icon: {color: "green", padding: 5, alignItems: 'right' },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    buttonwide: { marginTop: 10, width: 510, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 8px' },
}
export default UsersList;
