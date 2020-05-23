import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listMeetings } from '../graphql/queries'
import MeetingData from './MeetingsData';
import { setSelectedMeeting } from '../App';
import { deleteMeeting } from '../graphql/mutations'


const initState = {
    renderSelect : "LIST",
    editParam : "",
};

const MeetingsList = ({cbfn}) => {

    const [meetings, setMeetings] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchMeetings();
    }, [])

    function updateFetch() {
        console.log("updateFetch()")
        fetchMeetings();
    }
        
    async function fetchMeetings() {
        console.log("fetchMeetings()")

        setIsLoading(true)
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings))
            const meetings = meetingData.data.listMeetings.items
            setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
        setIsLoading(false)
    }

    async function delMeeting(id)  {
        console.log('deleting meeting:', id);
        const mtg = {
            id: id,
          };
        try {
            await API.graphql(graphqlOperation(deleteMeeting, {input: mtg}));
            updateFetch();
        } catch (err) {
            console.log('error deleting meeting:', err)
        }
        return false;
    }

    const driveRendering = ({mode, param, doit}) => {
        /* set some shit to state so that it causes rendering! */
        setState({renderSelect: mode});
        setState({editParam : param});
        console.log("Rendering for", uiState.renderSelect);
    }

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        const name = event.target.getAttribute('name');
        const desc = event.target.getAttribute('desc');

        setSelectedMeeting(id, name, desc);
        console.log("WTF", cbfn);

        fState.renderSelect="EDIT";
        fState.editParam=id;

        driveRendering("EDIT", id, true);

        console.log("handleEdit:", fState.renderSelect, fState.editParam);
    }
    
    const handleSelect = (event) => {
        const id = event.target.getAttribute('id');
        const name = event.target.getAttribute('name');
        const desc = event.target.getAttribute('desc');

        setSelectedMeeting(id, name, desc);
        console.log("WTF", cbfn);

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
                <h3>Meetings</h3>        
                {
                    meetings.map((meeting, index) => (
                        <div key={"divider" + index}>
                        <div key={"containerBox" + index} style={styles.rowcontainer}>
                            <div key={"meetingItem" + index} style={styles.rowcontainer}>
                                <div key={meeting.id ? meeting.id : index}>
                                    <p style={styles.meetingName}>{meeting.name}</p>
                                    <p style={styles.meetingDescription}>{meeting.description}</p>
                                </div>
                            </div>
                            <button style={styles.button} id={meeting.id} name={meeting.name} desc={meeting.description} onClick={handleEdit}>Edit</button>
                            <button style={styles.button} id={meeting.id} onClick={handleDelete}>Delete</button>
                            <button style={styles.button} id={meeting.id} name={meeting.name} desc={meeting.description} onClick={handleSelect}>Select</button>
                        </div>    
                            <hr className="App-horizontal-divider" />
                        </div>
                    ))
                }
                <button style={styles.buttonwide} onClick={handleCreate}>Create new meeting</button>
            </div>
        )
    )
}

else if (fState.renderSelect === "SELECT") {
    const selected = resetRenderSelection();
    return (
    <div style={styles.container}>
        <h3>Meeting selected:</h3>        
        {
            meetings.map((meeting, index) => (
                <div key={meeting.id ? meeting.id : index}>
                {
                meeting.id === selected 
                ? 
                    <div> 
                        <p style={styles.meetingDescription}>{meeting.id}</p>
                        <p/>
                        <p style={styles.meetingName}>{meeting.name}</p>
                        <p style={styles.meetingDescription}>{meeting.description}</p>
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
        <MeetingData itemId = {selected} updateMeetingsList = {updateFetch}/>  
    </div>
    )
}

else if (fState.renderSelect === "DELETE") {
    const selected = resetRenderSelection(); 
    const mtg = delMeeting(selected);

    var res = "";

    if (!mtg) res= "Deleting meeting " + selected + " failed.";
    else res = "Meeting " + selected + " deleted.";    
    
    return (
        <h4>{res}</h4>        
    )
}

else /* if (fState.renderSelect === "CREATE") */ {
    resetRenderSelection();
    return (
    <div style={styles.container}>
        <MeetingData updateMeetingsList = {updateFetch} />  
    </div>
    )
    
}
}

MeetingsList.propTypes = {
    cbfn: PropTypes.func
}

const styles = {
    container: { width: 500, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 500, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 5 },
    meetingName: { fontSize: 14, fontWeight: 'bold', margin: 0, padding: 0 },
    meetingDescription: { fontSize: 12, margin: 0, padding: 0 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    buttonwide: { marginTop: 10, width: 510, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 8px' },
}
export default MeetingsList;
