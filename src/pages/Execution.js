import React, { useEffect, useState } from 'react'
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'

import { listTopics, getMeeting, listVotingOptions } from '../graphql/queries'
import { updateTopic  } from '../graphql/mutations'

import { getSelectedMeeting } from '../App';
import { meetingInitialState } from'./MeetingsData';
import { topicInitialState } from'./TopicsData';


const initState = {
    renderSelect : "SHOWTOPIC",
    editParam : "",
};

const RunMeeting = () => {

    const fState = initState ;

    const [isLoading, setIsLoading] = useState(false);
    const [meetingState, setMeetingState] = useState();

    const [topics, setTopics] = useState([]);
    const [topicState, setTopicState] = useState(topicInitialState)
    const [topicIndex, setTopicIndex] = useState(0);
    const [topicActivated, setTopicActivated] = useState(false);
    const [mtgFetchAllowed, setMtgFetchAllowed] = useState(true);
    const [optFetchAllowed, setOptFetchAllowed] = useState(false);

    const [options, setOptions] = useState([]);

    const selectedMeeting = getSelectedMeeting();

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
            setOptFetchAllowed(true);
        };        
        switchTopic(topicIndex); 
    }, [topicIndex, topics])
    
    useEffect(() => 
    { 
        async function fetchOptions() {

            //create filter for fetching the needed voting options
            const filter = {or: []}
            topicState.voting_options.forEach(element => {
                const criteria = {eq: element};
                const query = {id: criteria};
                filter.or = [...filter.or, query];
            }); 

            //fetch the needed voting options
            try {
                const optionData = await API.graphql(graphqlOperation(listVotingOptions, {filter:filter}));
                var optionsList = optionData.data.listVotingOptions.items; 
                optionsList.sort(function(a,b){
                    return parseInt(a.option_number) - parseInt(b.option_number);
                    })
                console.log("OPTIONS (sorted):", optionsList)
                setOptions([...optionsList]);
            } catch (error) {
            console.log("Error fetching voting options:", error);
            }
            console.log("OPTIONS:", options)
        }

        console.log("fetchOPTIONS:", optFetchAllowed, topicState.id)

        if ((optFetchAllowed) && (topicState.id) && (topicState.id.length>0)) {
            setOptFetchAllowed(false);
            fetchOptions(); //fetch voting options 
        } 

    }, [topicState, options, optFetchAllowed])

    function saveResults() {
        //TODO: Save results DB or local file 
    }

    function isMeetingSelected() {
        if ((selectedMeeting)&&(selectedMeeting.id.length>0)) return true;
        return false;
    }

    async function updateActivation(state) {
        const topic = { ...topicState };
        topic.active = state;
        try {
            await API.graphql(graphqlOperation(updateTopic, {input: topic}))
        } catch (error) {
            console.log("error updating activation status", error);
        }
        setTopicActivated(state);
    }

    const handleCloseVoting = (event) => {
    //    let id = event.target.getAttribute('id');

        updateActivation(false);

        fState.renderSelect="SHOWTOPIC";
        fState.editParam='id';

    }

    const handleOpenVoting = (event) => {
    //    let id = event.target.getAttribute('id');

        updateActivation(true);

        fState.renderSelect="SHOWTOPIC";
        fState.editParam='id';

    }

    const handleNext = (event) => {
        //let id = event.target.getAttribute('id');
        const maxIndex = parseInt(meetingState.topics.length - 1); 

        let index = parseInt(topicIndex);
        if (index < maxIndex) {
            index++;
            setTopicIndex(index);
        } 
        console.log("topics.length", meetingState.topics.length);
        console.log("Max index:", maxIndex);
        console.log("Topic index:", index);

        fState.renderSelect="SHOWTOPIC";
        fState.editParam='id';

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

    }

    function resetRenderSelection() {
        const param = fState.editParam;
        fState.renderSelect="SHOWTOPIC";
        fState.editParam='';
        return (param);
    }
    
    if (!isMeetingSelected()) {
        fState.renderSelect="NOMEETING";
        fState.editParam='';
    }

    // ********  UI ********

    if (fState.renderSelect === "SHOWTOPIC") {
        return (
            isLoading ? (
                <div style={styles.info}>
                    <p/>
                    <div>Loading ...</div>
                </div>
            ) : (
                <div>
                    <div style={styles.buttonrowcontainer}>
                        <button style={styles.buttonLeft} onClick={handlePrev}>Previous topic</button>
                        <button style={styles.buttonRight} onClick={handleNext}>Next topic</button> 
                    </div> 
                    <div style={styles.container}>
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
                            style={styles.inputTitle}
                            value={`${topicState.topic_number}. ${topicState.topic_title}`}
                            placeholder="Topic number"
                            />
                        <textarea
                            readOnly={true}
                            rows={10} 
                            style={styles.input}
                            value={topicState.topic_text}
                            placeholder="Text"
                            />

                        <h5>Voting</h5>
                        {
                            options.map((option, index) => (
                                <div key={option.id ? option.id : index} style={styles.rowcontainer}>
                                    <textarea
                                        readOnly={true}
                                        style={styles.votingText}
                                        value={`${option.option_number}. ${option.option_text}`}
                                        placeholder="Voting option"
                                        />
                                    <textarea
                                        readOnly={true}
                                        style={styles.votingCount}
                                        value={option.votes}
                                        placeholder="Voting option"
                                        />
                                </div>
                            ))
                        }
                         
                        {
                        topicActivated
                        ?
                        <button style={styles.button} onClick={handleCloseVoting}>Close voting</button>
                        :
                        <button style={styles.button} onClick={handleOpenVoting}>Open voting</button>
                        }
                    
                    </div>
                </div>
            )
        )
    } 

    else /* if (fState.renderSelect === "NOMEETING") */ {
        resetRenderSelection();

        return (
        <div style={styles.container}>
            <h5>No meeting selected.</h5>        
            <h5>Select meeting first!</h5>        
        </div>
        )
        
    }
}

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 0 },
    rowcontainer: { height:35, width: 400, alignItems: 'right', color: 'black', backgroundColor:'#777', margin: '0 0', display: 'flex', flexDirection: 'row', padding: 0 },
    buttonrowcontainer: { width: 400, alignItems: 'center', color: 'black', marginBottom:4, display: 'flex', flexDirection: 'row', padding: 0 },
    input: { resize:'none', border: 'none', backgroundColor: 'white', marginBottom: 2, padding: 8, fontSize: 12 },
    inputTitle: { resize:'none',border: 'none', backgroundColor: 'white', marginBottom: 2, padding: 8, fontSize: 14, fontWeight: 'bold' },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 2, padding: 8, fontSize: 12 },
    votingText: { resize:'none', width: 300, border: 'none', backgroundColor: 'white', marginBottom: 1, marginRight:1, padding: 8, fontSize: 12 },
    votingCount: { resize:'none', width: 100, border: 'none', backgroundColor: 'white', marginBottom: 1, padding: 8, fontSize: 12 },
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 2, marginBottom: 8, padding: '12px 0px' },
    buttonLeft: { width: 200, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginRight: 2, padding: '12px 0px' },
    buttonRight: { width: 200, backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginLeft: 2, padding: '12px 0px' },
}

export default RunMeeting;