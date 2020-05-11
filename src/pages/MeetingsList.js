import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listMeetings } from '../graphql/queries'
import MeetingData from './MeetingsData';
import { setSelectedMeeting } from '../App';


const initState = {
    renderSelect : "LIST",
    editParam : "",
    doRender : false
};

const MeetingsList = () => {

    const [meetings, setMeetings] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);

    useEffect(() => {
        fetchMeetings();
    }, [])

    /*
    const metgs = { 
        id: '',
        name: '', 
        description: '',
        admins:  [...''],
        users:  [...''],
        topics:  [...'']
    }
   
    function createDummyList() {  
        var newmtgs = []
        for (var index = 0; index <5; index++ ) {
            const mtg = { metgs };
            mtg.id = generateId();
            mtg.name = 'meeting ' + index;
            mtg.description = 'meeting description ' + index;
            newmtgs.push(mtg);
            console.log("SIZE", newmtgs.length)
        }
        return newmtgs;
    }
    */
    
    async function fetchMeetings() {
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings))
            const meetings = meetingData.data.listMeetings.items
            setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
        finally {
         //   setMeetings(createDummyList());
        }
    }

    const driveRendering = ({mode, param, doit}) => {
        /* set some shit to state so that it causes rendering! */
        setState({renderSelect: mode});
        setState({editParam : param});
        setState({doRender : doit});
        console.log("Rendering for", uiState.renderSelect);
    }

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');

        fState.renderSelect="EDIT";
        fState.editParam=id;
        fState.doRender=true;

        driveRendering("EDIT", id, true);

        console.log("handleEdit:", fState.renderSelect, fState.editParam, fState.doRender);
    }
    
    const handleSelect = (event) => {
        const id = event.target.getAttribute('id');
        const name = event.target.getAttribute('name');
        const desc = event.target.getAttribute('desc');

        setSelectedMeeting(id, name, desc);

        fState.renderSelect="SELECT";
        fState.editParam=id;
        fState.doRender=true;

        driveRendering("SELECT", id, true);

        console.log("handleSelect:", fState.renderSelect, fState.editParam, fState.doRender);

    }

    const handleCreate = (event) => {

        fState.renderSelect="CREATE";
        fState.editParam='';
        fState.doRender=true;

        driveRendering("CREATE", '', true);

        console.log("handleCreate:", fState.renderSelect, fState.editParam, fState.doRender);
    }
    
    
    const handleDelete = (event) => {
        let id = event.target.getAttribute('id');
        console.log("delete item", id);
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
                    <button style={styles.button} id={meeting.id} onClick={handleEdit}>Edit</button>
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
        <MeetingData itemId = {selected} />  
    </div>
    )
}

else // (renderSelect == "CREATE") {
    resetRenderSelection();
    return (
    <div style={styles.container}>
        <MeetingData />  
    </div>
    )
    
}

const styles = {
    container: { width: 500, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 500, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 5 },
    meeting: { fontSize: 12, marginBottom: 15 },
    meetingName: { fontSize: 14, fontWeight: 'bold', margin: 0, padding: 0 },
    meetingDescription: { fontSize: 12, margin: 0, padding: 0 },
    topicDescription: { fontSize: 12, marginLeft: 20 },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    buttonwide: { marginTop: 10, width: 510, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 8px' },
}
export default MeetingsList;
