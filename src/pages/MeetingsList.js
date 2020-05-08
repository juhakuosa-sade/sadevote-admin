import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listMeetings } from '../graphql/queries'
import MeetingData from './MeetingsData';

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

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        console.log("handleEdit: ID", id);

        fState.renderSelect="EDIT";
        fState.editParam=id;
        fState.doRender=true;

        /* MIKS NÄÄ EI TOIMI?! */
        setState({renderSelect: "EDIT"});
        setState({editParam : id});
        setState({doRender : true});

        console.log("handleEdit1:", fState.renderSelect, fState.editParam, fState.doRender);
        console.log("handleEdit2:", uiState.renderSelect, uiState.editParam, uiState.doRender);

    }
    
    const handleDelete = (event) => {
        let id = event.target.getAttribute('id');
        console.log("delete item", id);
    }

    const renderEdit = () => {
        
        console.log("renderEdit1", fState.renderSelect, fState.editParam, fState.doRender );
        console.log("renderEdit2", uiState.renderSelect, uiState.editParam, uiState.doRender );

        if (!fState.doRender) return;
        fState.doRender=false;
        
        return (
            <MeetingData itemId = {fState.editParam} /> 
        );
        
        /*
        if (!uiState.doRender) return;
        setState({doRender : false});

        return (
            <MeetingData itemId = {uiState.editParam} /> 
        );
        */
    }
    

console.log("meetings count", meetings.length);

if (!fState.doRender && meetings.length>0) 
//if (!uiState.doRender && meetings.length>0) 
{ 
    fState.renderSelect = "LIST"; 
    fState.editParam = ''; 

    //setState({renderSelect: "LIST"});
    //setState({editParam : ''});
} 

if (fState.renderSelect === "LIST")
//if (uiState.renderSelect === "LIST")
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
                    
                </div>    

            ))
        }
                
    </div>
    )

else if (fState.renderSelect === "EDIT") {
    return (
    <div style={styles.container}>
        <MeetingData itemId = {fState.editParam} />  
    </div>
    )
}
/*
else if (uiState.renderSelect === "EDIT") {
    return (
    <div style={styles.container}>
        <MeetingData itemId = {uiState.editParam} />  
    </div>
    )
}
*/
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
    meetingName: { fontSize: 12, fontWeight: 'bold', margin: 0, padding: 0 },
    meetingDescription: { fontSize: 12, margin: 0, padding: 0 },
    topicDescription: { fontSize: 12, marginLeft: 20 },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
}
export default MeetingsList;
