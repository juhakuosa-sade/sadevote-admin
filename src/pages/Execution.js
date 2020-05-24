import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listTopics, getTopic } from '../graphql/queries'
import { getMeeting } from '../graphql/queries'
import { listVotingOptions } from '../graphql/queries'

import { getSelectedMeeting } from '../App';
import { meetingInitialState } from'./MeetingsData';
import { topicInitialState } from'./TopicsData';
import CatInputs from './CatInputs';


const initState = {
    renderSelect : "SHOWTOPIC",
    editParam : "",
};

const RunMeeting = () => {

    const fState = initState ;
    const [uiState, setUiState] = useState(initState);

    const [isLoading, setIsLoading] = useState(false);
    const [meetingState, setMeetingState] = useState();

    const [topics, setTopics] = useState([]);
    const [topicState, setTopicState] = useState(topicInitialState)
    const [topicIndex, setTopicIndex] = useState(0);
    const [topicActivated, setTopicActivated] = useState(false);
    const [mtgFetchAllowed, setMtgFetchAllowed] = useState(true);

    const [options, setOptions] = useState([]);

    const selectedMeeting = getSelectedMeeting();

    /*
const filter = {or: []}
meeting.topics.forEach(element => {
    const criteria = {eq: element};
    const query = {id: criteria};
    filter.or = [...filter.or, query];
});              
const tpcs = await API.graphql(graphqlOperation(listTopics, {id: id}));
const topics = tpcs.data.listTopics.items;
topics.sort(function(a,b){
    return parseInt(a.topic_number) - parseInt(b.topic_number);
    })  
    */
   /*
const tpcs = await API.graphql(graphqlOperation(listTopics));
const stopics = tpcs.data.listTopics.items;
stopics.sort(function(a,b){
    return parseInt(a.id) - parseInt(b.id);
});

const filter = {or: []}
stopics.forEach(element => {
    const criteria = {eq: element};
    const query = {id: criteria};
    filter.or = [...filter.or, query];
});       
const topics = stopics.filter(filter);
topics.sort(function(a,b){
    return parseInt(a.topic_number) - parseInt(b.topic_number);
})  
    */

    useEffect(() => 
    { 
        async function fetchMeetingAndTopics(id) {
            setIsLoading(true);
            try {
                const mtg = await API.graphql(graphqlOperation(getMeeting, {id: id}));
                const meeting = {...mtg.data.getMeeting};
                setMeetingState({...meeting});
                
                const filter = {or: []}
                meeting.topics.forEach(element => {
                    const criteria = {eq: element};
                    const query = {id: criteria};
                    filter.or = [...filter.or, query];
                });              
                const tpcs = await API.graphql(graphqlOperation(listTopics, {filter: filter}));
                const topics = tpcs.data.listTopics.items;
                topics.sort(function(a,b){
                    return parseInt(a.topic_number) - parseInt(b.topic_number);
                    })
                setTopics([...topics]);
    
                setTopicState({...topics[topicIndex]});
    
            } catch (error) {
                console.log("Error in getting meeting topics ( getMeetingTopics(id) )", error)
                setMeetingState({...meetingInitialState});
            }
            setIsLoading(false);
        }

        if (mtgFetchAllowed) {
            setMtgFetchAllowed(false);
            fetchMeetingAndTopics(selectedMeeting.id); //fetch meeting and topics
        }        
        return () => {
           saveResults();
        }
    }, [selectedMeeting.id, topicIndex, mtgFetchAllowed])

    useEffect(() => 
    { 
        const switchTopic = (index) => {
            setTopicState({...topics[index]});
        };        
        switchTopic(topicIndex); 
    }, [topicIndex, topics])
    
    useEffect(() => 
    { 
       fetchOptions(topicState.voting_options); //fetch voting options 
    }, [topicState])

    function saveResults() {
        //TODO: Save results DB or local file 
    }

    function isMeetingSelected() {
        if ((selectedMeeting)&&(selectedMeeting.id.length>0)) return true;
        return false;
    }

function fetchOptions(optionIdArray) {

}
/*
    const fetchOptions = async (idArray) => {
        console.log("idArray length: ", idArray.length);

        //create filter for fetching the needed voting options
        const filter = {or: []}
        idArray.forEach(element => {
            const criteria = {eq: element};
            const query = {id: criteria};
            filter.or = [...filter.or, query];
        });  

        //fetch the needed voting options
        try {
            const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions, {filter:filter}));
            var votingOptionsList = votingOptionData.data.listVotingOptions.items; 
            votingOptionsList.sort(function(a,b){
                return parseInt(a.option_number) - parseInt(b.option_number);
                })     
        
            var cats = [];
            votingOptionsList.forEach(element => {
                const cat = { votingOptionId: element.id, catNumber: element.option_number, catText: element.option_text };
                cats = [...cats, {...cat}]
            });
            setCats(cats);
            return votingOptionData;
        } catch (error) {
            console.log("Error fetching voting options:", error);
        }
    }
   */    
    const driveRendering = ({mode, param}) => {
        /* set some shit to state so that it causes rendering! */
        const drive = {
            renderSelect: mode,
            editParam : param,
        }
        setUiState(drive)
    }

    const handleTbd = (event) => {
        let id = event.target.getAttribute('id');

        fState.renderSelect="TBD";
        fState.editParam='id';

        driveRendering("TBD", id);
    }

    const handleNext = (event) => {
        //let id = event.target.getAttribute('id');
        const maxIndex = parseInt(meetingState.topics.length - 1); 

        let index = parseInt(topicIndex);
        if (index < maxIndex - 1) {
            index++;
            setTopicIndex(index);
        } 
        console.log("Topic index:", index);

        fState.renderSelect="SHOWTOPIC";
        fState.editParam='id';

       // driveRendering("SHOWTOPIC", id);
    }

    const handlePrev = (event) => {
        //let id = event.target.getAttribute('id');

        let index = parseInt(topicIndex);
        if (index > 0) {
            index--;
            setTopicIndex(index);
        } 
        console.log("Topic index:", index);

        fState.renderSelect="SHOWTOPIC";
        fState.editParam='id';

       // driveRendering("SHOWTOPIC", id);
    }

    function resetRenderSelection() {
        const param = fState.editParam;
        fState.renderSelect="SHOWTOPIC";
        fState.editParam='';
        return (param);
    }
    
    //console.log("Rendering", fState.renderSelect);
    if (!isMeetingSelected()) {
        fState.renderSelect="NOMEETING";
        fState.editParam='';
    }

    if (fState.renderSelect === "SHOWTOPIC") {
        return (
            isLoading ? (
                <div style={styles.info}>
                    <p/>
                    <div>Loading ...</div>
                </div>
            ) : (
                <div style={styles.container}>
                <h3>Running Topic</h3>
                <textarea
                    style={styles.inputDisabled}
                    value={topicState.id}
                    placeholder="ID"
                    readOnly={true}
                    disabled={true}
                    hidden={false}
                />
                <textarea
                    readOnly={true}
                    style={styles.input}
                    value={topicState.topic_number}
                    placeholder="Topic number"
                />
                <textarea
                    readOnly={true}
                    style={styles.input}
                    value={topicState.topic_title}
                    placeholder="Title"
                />
                <textarea
                    readOnly={true}
                    rows={10} 
                    style={styles.input}
                    value={topicState.topic_text}
                    placeholder="Text"
                />
                
                <h5>Voting options</h5>
            
                <button style={styles.button} onClick={handleNext}>Next topic</button> 
                <button style={styles.button} onClick={handlePrev}>Previous topic</button> 
                    
                {
                topicActivated
                ?
                <button style={styles.button} onClick={handleTbd}>Close voting</button>
                :
                <button style={styles.button} onClick={handleTbd}>Open voting</button>
                }
            
            </div>
            )
        )
    } 

    else if (fState.renderSelect === "TBD") {
        return (
            <div style={styles.container}>
                <h4>tbd...</h4>        
            </div>
            )    
    }

    else /* if (fState.renderSelect === "NOMEETING") */ {
        resetRenderSelection();

        return (
        <div style={styles.container}>
            <h4>No meeting selected.</h4>        
            <h4>Select meeting first!</h4>        
        </div>
        )
        
    }
}

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 396, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 2 },
    input: { border: 'none', backgroundColor: 'white', marginBottom: 2, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 2, padding: 8, fontSize: 12 },
    input3: { border: 'none', backgroundColor: 'white', marginBottom: 0, padding: 8, fontSize: 12 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 2, marginBottom: 8, padding: '12px 0px' },
    button2: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 0, marginBottom: 0, padding: '10 8' }
}

export default RunMeeting;



/*
const RunMeeting = () => {

    const [topics, setTopics] = useState([]);
    const fState = initState ;
    const [uiState, setState] = useState(initState);
    const [isLoading, setIsLoading] = useState(false);
    const [mtgFetchAllowed, setMtgFetchAllowed] = useState(true);
    const [mtgState, setMtgState] = useState();
    const [noMeetingSelected, setNoMeetingSelected] = useState(false);
    const [topicState, setTopicState] = useState(topicInitialState)
    const [currentIdx, setCurrentIdx] = useState(0);
    const [useUpdate, setUseUpdate] = useState(false);
    const [catState, setCatState] = useState([]);
    const [usePrefill, setUsePrefill] = useState(true);



    const selectedMeeting = getSelectedMeeting();
    var topicIdList = [];


    useEffect(() => 
    { 
       setState({doFetch : true});
    }, [])
 
    useEffect(() => {
        async function getMeetingTopics(id) {

            try {
                const mtg = await API.graphql(graphqlOperation(getMeeting, {id: id}));
                const meeting = {...mtg.data.getMeeting}
                setMtgState({...meeting}); 
            } catch (error) {
                console.log("Error in getting meeting topics ( getMeetingTopics(id) )", error);
                setMtgState({...meetingInitialState}); 
                setNoMeetingSelected(true); 
            }
        }

        if (mtgFetchAllowed) {
            setMtgFetchAllowed(false)
            getMeetingTopics(selectedMeeting.id)
        }

    }, [selectedMeeting.id, mtgFetchAllowed])
   
    useEffect(() => {

        const idArray = topicState.voting_options;

        const fetchVotingOptions = async () => {
            console.log("idArray length: ", idArray.length);

            //create filter for fetching the needed voting options
            const filter = {or: []}
            idArray.forEach(element => {
                const criteria = {eq: element};
                const query = {id: criteria};
                filter.or = [...filter.or, query];
            });  
    
            //fetch the needed voting options
            try {
                const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions, {filter:filter}));
                var votingOptionsList = votingOptionData.data.listVotingOptions.items; 
                votingOptionsList.sort(function(a,b){
                    return parseInt(a.option_number) - parseInt(b.option_number);
                   })     
            
                var cats = [];
                votingOptionsList.forEach(element => {
                    const cat = { votingOptionId: element.id, catNumber: element.option_number, catText: element.option_text };
                    cats = [...cats, {...cat}]
                });
                setCats(cats);
                return votingOptionData;
            } catch (error) {
                console.log("Error fetching voting options:", error);
            }
        };
       
        if (usePrefill && idArray && idArray.length>0) { //attempt to fetch with empty filter will cause DynamoDB error
            fetchVotingOptions();
        }
        
    }, [topicState.voting_options, usePrefill]);

    const setCats = (cats) => {
        setCatState([...cats]);
    };

    if (uiState.doFetch) 
    { 
        fetchTopics(); 
        setState({doFetch : false}); 
    }

    //TODO: new fetchTopics based on using mtgState and topics filter
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

            const topic = await API.graphql(graphqlOperation(getTopic, {id: topicIdList[currentIdx]}));
            setTopicState({ ...topic });
            
        } catch (err) { console.log('error fetching topics') }
        setIsLoading(false)
    
    }

    const driveRendering = ({mode, param}) => {
        // set some shit to state so that it causes rendering!
        const drive = {
            renderSelect: mode,
            editParam : param,
        }
        setState(drive)
    }

    const handleTbd = (event) => {
        let id = event.target.getAttribute('id');

        fState.renderSelect="TBD";
        fState.editParam='id';

        driveRendering("TBD", id);
    }

    function resetRenderSelection() {
        const param = fState.editParam;
        fState.renderSelect="SHOWTOPIC";
        fState.editParam='';
        return (param);
    }
    
//console.log("Rendering", fState.renderSelect);
if (noMeetingSelected) {
    fState.renderSelect="NOMEETING";
    fState.editParam='';
}

if (fState.renderSelect === "SHOWTOPIC") {
    return (
        isLoading ? (
            <div style={styles.info}>
                <p/>
                <div>Loading ...</div>
            </div>
        ) : (
            <div style={styles.container}>
            <h3>Topic</h3>
            <input
                style={styles.inputDisabled}
                value={topicState.id}
                placeholder="ID"
                readOnly={true}
                disabled={true}
                hidden={false}
            />
            <input
                readOnly={true}
                style={styles.input}
                value={topicState.topic_number}
                placeholder="Topic number"
            />
            <input
                readOnly={true}
                style={styles.input}
                value={topicState.topic_title}
                placeholder="Title"
            />
            <textarea
                readOnly={true}
                rows={10} 
                style={styles.input}
                value={topicState.topic_text}
                placeholder="Text"
            />
            
            <h5>Voting options</h5>
           {
            catState.map((val, idx) => (
                <div key={"containerBox" + idx} style={styles.rowcontainer}>
                    <CatInputs
                        style={styles.input3}
                        key={`cat-${idx}`}
                        idx={idx}
                        catState={catState}
                    />
                </div>

            ))
            }
            <button style={styles.button} onClick={handleTbd}>NEXT</button> 
            <button style={styles.button} onClick={handleTbd}>PREV</button> 
                
            {
            useUpdate
            ?
            <button style={styles.button} onClick={handleTbd}>Activate</button>
            :
            <button style={styles.button} onClick={handleTbd}>Deactivate</button>
            }
        
        </div>
        )
    )
} 

else if (fState.renderSelect === "TBD") {
    return (
        <div style={styles.container}>
            <h4>tbd...</h4>        
        </div>
        )    
}

else if (fState.renderSelect === "NOMEETING")  {
    resetRenderSelection();

    return (
    <div style={styles.container}>
        <h4>No meeting selected.</h4>        
        <h4>Select meeting first!</h4>        
    </div>
    )
    
}
}
*/