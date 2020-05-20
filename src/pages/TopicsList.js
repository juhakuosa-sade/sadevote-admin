import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listTopics } from '../graphql/queries'
import { getMeeting } from '../graphql/queries'

import TopicData from './TopicsData';
import { getSelectedMeeting } from '../App';
import { deleteTopic } from '../graphql/mutations'


const initState = {
    renderSelect : "LIST",
    editParam : "",
    doFetch : false
};

var listedTopics = [...''];
export function getListedTopics() {
    return [...listedTopics]
}

const TopicsList = () => {

    const [topics, setTopics] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);
    const selectedMeeting = getSelectedMeeting();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => 
    { 
        setState({doFetch : true});
    }, [])
    
   
    function updateFetch() {
        fetchTopics();
    }

    function updateFetchDelayed() {
        fetchTopics();
        setTimeout(() => {
            fetchTopics(); 
        }, 3000);
    }

    var topicIdList = [...''];

    if (uiState.doFetch) 
    { 
        fetchTopics(); 
        setState({doFetch : false}); 
    }

    async function fetchTopics() {
        console.log('fetchTopics')
        setIsLoading(true)
        try {
            const meeting = await API.graphql(graphqlOperation(getMeeting, {id: selectedMeeting.id}));
            topicIdList = [...meeting.data.getMeeting.topics]

            const topicData = await API.graphql(graphqlOperation(listTopics))
            const topics = topicData.data.listTopics.items

            var filteredTopics = [...''];
            topicIdList.forEach(element => {
                topics.forEach(topic => {
                    if (element === topic.id) {
                        filteredTopics = [...filteredTopics, topic]
                    }
                });
             });

            setTopics(filteredTopics)
            listedTopics = [];
            filteredTopics.forEach(element => {
                listedTopics = [...listedTopics, element.id]
            });

        } catch (err) { console.log('error fetching topics') }
        setIsLoading(false)
    
    }

    async function delTopic(id)  {
        console.log('deleting topic:', id);
        const tpc = {
            id: id,
          };
        try {
            await API.graphql(graphqlOperation(deleteTopic, {input: tpc}));
            updateFetch();
        } catch (err) {
            console.log('error deleting topic:', err)
        }
        return false;
    }

    const driveRendering = ({mode, param, doit}) => {
        /* set some shit to state so that it causes rendering! */
        const drive = {
            renderSelect: mode,
            editParam : param,
        }
        setState(drive)

        console.log("Rendering for", uiState.renderSelect);
    }

    const handleEdit = (event) => {
        const id = event.target.getAttribute('id');
        
        fState.renderSelect="EDIT";
        fState.editParam=id;

        driveRendering("EDIT", id, true);

        console.log("handleEdit:", fState.renderSelect, fState.editParam);
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
                <h3>Topics</h3>        
                {
                    topics.map((topic, index) => (
                        <div key={"divider" + index}>
                        <div key={"containerBox" + index} style={styles.rowcontainer}>
                            <div key={"topicItem" + index} style={styles.rowcontainer}>
                                <div key={topic.id ? topic.id : index}>
                                    <p style={styles.topicTitle}>{topic.topic_number}. {topic.topic_title}</p>
                                    <p style={styles.topicText}>{topic.topic_text}</p>
                                </div>
                            </div>
                            <button style={styles.button} id={topic.id} onClick={handleEdit}>Edit</button>
                            <button style={styles.button} id={topic.id} onClick={handleDelete}>Delete</button>
                        </div>    
                            <hr className="App-horizontal-divider" />
                        </div>
                    ))
                }
                <button style={styles.buttonwide} onClick={handleCreate}>Create new topic</button>
            </div>
        )
    )
} 

else if (fState.renderSelect === "EDIT") {
    const selected = resetRenderSelection(); 
    return (
    <div style={styles.container}>
        <TopicData itemId = {selected} updateTopicsList = {updateFetch} />  
    </div>
    )
}

else if (fState.renderSelect === "DELETE") {
    const selected = resetRenderSelection(); 
    const tpc = delTopic(selected);

    var res = "";

    if (!tpc) res= "Deleting topic " + selected + " failed.";
    else res = "Topic " + selected + " deleted.";    
    
    return (
        <h4>{res}</h4>        
    )
}

else /* if (fState.renderSelect === "CREATE") */ {
    resetRenderSelection();

    return (
    <div style={styles.container}>
        <TopicData updateTopicsList = {updateFetchDelayed} />  
    </div>
    )
    
}
}

const styles = {
    container: { width: 500, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 500, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 5 },
    topicTitle: { fontSize: 14, fontWeight: 'bold', margin: 0, padding: 0 },
    topicText: { fontSize: 12, margin: 0, padding: 0 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { width: 100, marginLeft: "auto", backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '8px 0px' },
    buttonwide: { marginTop: 10, width: 510, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, padding: '12px 8px' },
}
export default TopicsList;
