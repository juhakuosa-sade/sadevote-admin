import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listMeetings } from '../graphql/queries'
import MeetingData from './MeetingsData';
import App, { setSelectedMeeting } from '../App';


const initState = {
    renderSelect : "CREATE",
    editParam : "",
    doRender : false
};

const MeetingsList = () => {

    const [meetings, setMeetings] = useState([]);
    const fState = initState;
    const [uiState, setState] = useState(initState);

    useEffect(() => {
        fetchMeetings();
    }, [])

    async function fetchMeetings() {
        try {
            const meetingData = await API.graphql(graphqlOperation(listMeetings))
            const meetings = meetingData.data.listMeetings.items
            setMeetings(meetings)
        } catch (err) { console.log('error fetching meetings') }
    }

    const driveRendering = ({param, doit}) => {
        /* set some shit to state so that it causes rendering! */
        setState({renderSelect: "LIST"});
        setState({editParam : param});
        setState({doRender : doit});
    }

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        console.log("handleEdit: ID", id);

        fState.renderSelect="EDIT";
        fState.editParam=id;
        fState.doRender=true;

        driveRendering(id, true);

        console.log("handleEdit1:", fState.renderSelect, fState.editParam, fState.doRender);
    }
    
    const handleSelect = (event) => {
        const id = event.target.getAttribute('id');
        const name = event.target.getAttribute('name');
        const desc = event.target.getAttribute('desc');

        console.log("handleSelect: ID", id);

        setSelectedMeeting(id, name, desc);

        fState.renderSelect="SELECT";
        fState.editParam=id;
        fState.doRender=true;

        /* MIKS NÄÄ EI TOIMI?! */
        setState({renderSelect: "SELECT"});
        setState({editParam : id});
        setState({doRender : true});

        console.log("handleSelect:", fState.renderSelect, fState.editParam, fState.doRender);

    }
    
    const handleDelete = (event) => {
        let id = event.target.getAttribute('id');
        console.log("delete item", id);
    }

    const renderEdit = () => {
        if (!fState.doRender) return;
        fState.doRender=false;
        
    }
    
    const renderSelect = () => {
        if (!fState.doRender) return;
        fState.doRender=false;
        
    }
    

console.log("Rendering", fState.renderSelect);

if (!fState.doRender && meetings.length>0) 
{ 
    fState.renderSelect = "LIST"; 
    fState.editParam = ''; 

} 

if (fState.renderSelect === "LIST") {
    return (
    <div style={styles.container}>
        <h3>Meetings</h3>        
        {
            meetings.map((meeting, index) => (
                <div key={"containerBox" + index} style={styles.rowcontainer}>
                    <div key={"meetingItem" + index} style={styles.rowcontainer}>
                        <div key={meeting.id ? meeting.id : index}>
                            <p style={styles.meetingName}>{meeting.name}</p>
                            <p style={styles.meetingDescription}>{meeting.description}</p>
                        </div>
                    </div>
                    <button style={styles.button} id={meeting.id} onClick={handleEdit}>Edit</button>
                    {renderEdit()}
                    <button style={styles.button} id={meeting.id} onClick={handleDelete}>Delete</button>
                    <button style={styles.button} id={meeting.id} name={meeting.name} desc={meeting.description} onClick={handleSelect}>Select</button>
                    {renderSelect()}
                </div>    

            ))
        }
                
    </div>
    )
    }

else if (fState.renderSelect === "SELECT") {
    const selected = fState.editParam;
    fState.renderSelect="LIST";
    fState.editParam='';
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
    return (
    <div style={styles.container}>
        <MeetingData itemId = {fState.editParam} />  
    </div>
    )
}

else // (renderSelect == "CREATE")
    return (
    <div style={styles.container}>
        <MeetingData />  
    </div>
    )

}
const styles = {
    container: { width: 500, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'white', width: 500, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 5 },
    meeting: { fontSize: 12, marginBottom: 15 },
    meetingName: { fontSize: 14, fontWeight: 'bold', margin: 0, padding: 0 },
    meetingDescription: { fontSize: 12, margin: 0, padding: 0 },
    topicDescription: { fontSize: 12, marginLeft: 20 },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
}
export default MeetingsList;
