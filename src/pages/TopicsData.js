import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import CatInputs from './CatInputs';

import '../App.css';
import { generateId, getSelectedMeeting } from '../App'
import { getListedTopics } from './TopicsList'

import { addTopicToList } from './MeetingsData'

import { API, graphqlOperation } from 'aws-amplify'
import { listTopics, getMeeting } from '../graphql/queries'

import { createTopic, updateTopic, updateMeeting } from '../graphql/mutations'
import { createVotingOption } from '../graphql/mutations'
//import { listVotingOptions } from '../graphql/queries'


const topicInitialState = {
    id: generateId(),
    topic_number: '',
    topic_title: '',
    topic_text: '',
    voting_options: [...''],
    voting_options_count: 0,
    active: false,
    voting_percentage: 0.0,
}

const votingOptionInitialState = {
    topic_id: '',
    topic_number: '',
    id: '',
    option_number: 0,
    option_text: '',
    votes: 0,
    unanimously_selected: false,
}

var prefill = true;
var useUpdate = false;

const TopicsData = ({itemId, updateTopicsList}) => {
    const selectedMeeting = getSelectedMeeting();
    var listedTopics = getListedTopics();
    console.log("listedTopics get", listedTopics)

    async function updateMeetingData(id) {
        try {
            const mtg = await API.graphql(graphqlOperation(getMeeting, {id: selectedMeeting.id}));
            let meeting = {...mtg.data.getMeeting}
            listedTopics = [...listedTopics, topicState.id];
            meeting.topics = [...listedTopics];
            console.log('updateMeetingData:', meeting)
            await API.graphql(graphqlOperation(updateMeeting, {input: meeting}));
        } catch (err) { console.log('error updating meeting:', err) }
    }

/** Cat */
    const blankCat = { catNumber: '', catText: '' };
    const [catState, setCatState] = useState([
        { ...blankCat },
    ]);

    function clearCatState() {
        setCatState([{ ...blankCat }]);
    };

    const addCat = () => {
        setCatState([...catState, { ...blankCat }]);
    };

    const handleCatChange = (e) => {
        const updatedCats = [...catState];
        updatedCats[e.target.dataset.idx][e.target.className] = e.target.value;
        setCatState(updatedCats);
        console.log("handleCatChange:catState", {...catState});
        console.log("handleCatChange:catState.length:", catState.length);
    };

/** Voting options */
    const votingOptionToAdd = { ...votingOptionInitialState }
/*
    async function fetchVotingOptions() {
        try {
            const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions))
            const votingOptions = votingOptionData.data.listVotingOptions.items
        } catch (err) { console.log('error fetching votingOptions') }
    }
*/
    async function addVotingOption() {
        try {
            if (!(votingOptionToAdd.id)) {
                console.log('error creating votingOption: ID = ',votingOptionToAdd.id);
                console.log('error creating votingOption: text = ',votingOptionToAdd.option_text);
                return
            }
            const votingOption = { ...votingOptionToAdd }
            console.log('creating votingOption:', votingOption)
            await API.graphql(graphqlOperation(createVotingOption, {input: votingOption}))
        } catch (err) {
            console.log('error creating votingOption:', err)
        }
    }

    function composeVotingOption(idx) {
        votingOptionToAdd.topic_id = topicState.id; 
        votingOptionToAdd.topic_number = topicState.topic_number; 
        votingOptionToAdd.id = topicState.id + '-' + topicState.topic_number + '-' + catState[idx].catNumber;
        votingOptionToAdd.option_number = catState[idx].catNumber;
        votingOptionToAdd.option_text = catState[idx].catText;
        votingOptionToAdd.votes = 0;
        votingOptionToAdd.unanimously_selected = false;
    }

    function prefillVotingOptions(votingOptions) {
        console.log("prefillVotingOptions", votingOptions);
        
    }

/** Topics */
    const [topicState, setTopicState] = useState(topicInitialState)
    const [topics, setTopics] = useState([])

    useEffect(() => {
        fetchTopics()
    }, []);

    useEffect(() => { 
        // do after mounting   
            enablePrefill();
            setTopicState({...topicInitialState});
        // do before unmounting
        return () => {
            restoreState();
        };
      }, []); // passing empty array means do only once (https://reactjs.org/docs/hooks-effect.html)



    function setInput(key, value) {
        setTopicState({ ...topicState, [key]: value })
    }

    if (itemId) {
        preFillForm(itemId, topics);
    }

    function restoreState() {
        prefill = true;
        useUpdate=false;
    }
    
    function getTopic(itemId, topics) {
        var tpc = {...topicInitialState};

        topics.forEach(topic => {
        if (itemId === topic.id) {
            console.log("getTopic: found it!");
            useUpdate=true;
            tpc = {...topic};
        }
        });
        
        return tpc;
    }

    function preFillForm(itemId) {
        console.log("preFillForm", itemId)

        if (!prefill) {
            console.log("SKIP prefill")
            return
        }
        const tpc = getTopic(itemId, topics);
        topicState.id = tpc.id;
        topicState.topic_number = tpc.topic_number;
        topicState.topic_title = tpc.topic_title;
        topicState.topic_text = tpc.topic_text;
        topicState.voting_options = tpc.voting_options;
        topicState.voting_options_count = tpc.voting_options_count;
        topicState.active = tpc.active;
        topicState.voting_percentage = tpc.voting_percentage;
        console.log("preFillForm", topicState);
        prefillVotingOptions(topicState.voting_options);
    }

    function clearState() {
        topicInitialState.id = generateId();
        clearCatState();
        setTopicState(topicInitialState)
    }

    async function fetchTopics() {
        
        try {
            const topicData = await API.graphql(graphqlOperation(listTopics))
            const topics = topicData.data.listTopics.items
            setTopics(topics)
        } catch (err) { console.log('error fetching topics') }
    }

    async function addTopic() {
        try {
        if (!topicState.id || !topicState.topic_number) {
            console.log('error creating topic: ID = ',topicState.id);
            console.log('error creating topic: title = ',topicState.topic_title);
            return
        }
        const topic = { ...topicState }
        //console.log("addTopic:creating topic:", topic)
        //console.log("addTopic:catState", {...catState});
        
        let index = 0;
        catState.forEach(element => 
            {
                console.log("foreach: ", index, element.catNumber, element.catText);
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    composeVotingOption(index++);
                    addVotingOption();          
                }
                else {
                    console.log("foreach skipping: ", index, element.catNumber, element.catText);
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic});
        setTopics([...topics, topic]);
        addTopicToList(topic.id);

        await API.graphql(graphqlOperation(createTopic, {input: topic}));

        updateTopicsList();
        updateMeetingData(topic.id);
        
        clearState();
        
    } catch (err) {
            console.log('error creating topic:', err);
        }
    }

    async function updTopic() {
        try {
        if (!topicState.id || !topicState.topic_number) {
            console.log('error creating topic: ID = ',topicState.id);
            console.log('error creating topic: title = ',topicState.topic_title);
            return
        }
        const topic = { ...topicState }
        //console.log("updTopic:creating topic:", topic)
        //console.log("updTopic:catState", {...catState});
        
        let index = 0;
        catState.forEach(element => 
            {
                console.log("foreach: ", index, element.catNumber, element.catText);
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    composeVotingOption(index++);
                    addVotingOption();          
                }
                else {
                    console.log("foreach skipping: ", index, element.catNumber, element.catText);
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic});
        setTopics([...topics, topic]);
        addTopicToList(topic.id);

        await API.graphql(graphqlOperation(updateTopic, {input: topic}));

        updateTopicsList();
        clearState();

    } catch (err) {
            console.log('error creating topic:', err);
        }
    }

    function disablePrefill() {
        prefill = false;
    }

    function enablePrefill() {
        prefill = true;
    }
    

/** UI */
    return(   
        <div style={styles.container}>
            <h3>Topics</h3>
            <input
                onFocus={disablePrefill}
                onChange={event => setInput('id', event.target.value)}
                style={styles.inputDisabled}
                value={topicState.id}
                placeholder="ID"
                disabled={true}
                hidden={false}
            />
            <input
                onFocus={disablePrefill}                
                onChange={event => setInput('topic_number', event.target.value)}
                style={styles.input}
                value={topicState.topic_number}
                placeholder="Topic number"
            />
            <input
                onFocus={disablePrefill}
                onChange={event => setInput('topic_title', event.target.value)}
                style={styles.input}
                value={topicState.topic_title}
                placeholder="Title"
            />
            <textarea
                onFocus={disablePrefill}
                onChange={event => setInput('topic_text', event.target.value)}
                rows={10} 
                style={styles.input}
                value={topicState.topic_text}
                placeholder="Text"
            />
        
            <button style={styles.button} onClick={addCat}>Add voting option</button> 
            {
            catState.map((val, idx) => (
                <CatInputs
                    style={styles.input}
                    key={`cat-${idx}`}
                    idx={idx}
                    catState={catState}
                    handleCatChange={handleCatChange}
                />
            ))
            }
                
                {
        useUpdate
        ?
        <button style={styles.button} onClick={updTopic}>Update Topic</button>
        :
        <button style={styles.button} onClick={addTopic}>Create Topic</button>
        }
        
        </div>
        )    
}

TopicsData.propTypes = {
    itemId: PropTypes.string,
    updateTopicsList: PropTypes.func,
}


const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    topic: {  fontSize: 12, marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 10, padding: 8, fontSize: 12 },
    input2: { border: 'none', backgroundColor: '#ddd', marginBottom: 20, padding: 20, fontSize: 12 },
    topicName: { fontSize: 12, fontWeight: 'bold' },
    topicDescription: { fontSize: 12, marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginBottom: 10, padding: '12px 0px' },
    button2: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 10, marginBottom: 10, padding: '12px 0px' }
}

export default TopicsData;