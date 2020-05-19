import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import CatInputs from './CatInputs';

import '../App.css';
import { generateId, getSelectedMeeting } from '../App'
import { getListedTopics } from './TopicsList'

import { API, graphqlOperation } from 'aws-amplify'
import { listTopics, getMeeting, listVotingOptions } from '../graphql/queries'

import { createTopic, updateTopic, updateMeeting, updateVotingOption } from '../graphql/mutations'
import { createVotingOption } from '../graphql/mutations'


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

const TopicsData = ({itemId, updateTopicsList}) => {
    
    const selectedMeeting = getSelectedMeeting();
    var listedTopics = getListedTopics();

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
    const blankCat = { votingOptionId: '', catNumber: '', catText: '' };
    const [catState, setCatState] = useState([]);

    function clearCatState() {
        setCatState([]);
    };

    const addBlankCat = () => {
        var cat = { ...blankCat };
        cat.catNumber = catState.length + 1;
        setCatState([...catState, { ...cat }]);
    };

    const setCats = (cats) => {
        setCatState([...cats]);
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

    async function updVotingOption() {
        try {
            if (!(votingOptionToAdd.id)) {
                console.log('error creating votingOption: ID = ',votingOptionToAdd.id);
                console.log('error creating votingOption: text = ',votingOptionToAdd.option_text);
                return
            }
            const votingOption = { ...votingOptionToAdd }
            console.log('updating votingOption:', votingOption)
            await API.graphql(graphqlOperation(updateVotingOption, {input: votingOption}))
        } catch (err) {
            console.log('error updating votingOption:', err)
        }
    }
    function composeNewVotingOption(idx) {
        votingOptionToAdd.topic_id = topicState.id; 
        votingOptionToAdd.topic_number = topicState.topic_number; 
        votingOptionToAdd.id = generateId();
        votingOptionToAdd.option_number = catState[idx].catNumber;
        votingOptionToAdd.option_text = catState[idx].catText;
        votingOptionToAdd.votes = 0;
        votingOptionToAdd.unanimously_selected = false;
    }

    function composeOldVotingOption(idx, id) {
        votingOptionToAdd.topic_id = topicState.id; 
        votingOptionToAdd.topic_number = topicState.topic_number; 
        votingOptionToAdd.id = id;
        votingOptionToAdd.option_number = catState[idx].catNumber;
        votingOptionToAdd.option_text = catState[idx].catText;
        votingOptionToAdd.votes = 0;
        votingOptionToAdd.unanimously_selected = false;
    }

/** Topics */
    const [topicState, setTopicState] = useState(topicInitialState)
    const [topics, setTopics] = useState([])
    const [votingOptions, setVotingOptions] = useState([])
    const [usePrefill, setUsePrefill] = useState(false);
    const [useUpdate, setUseUpdate] = useState(false);

    /***** FETCH DATA *****/
    useEffect(() => {
        fetchTopics()
    }, []);

    /***** ON START, ON STOP *****/
    useEffect(() => { 
        // do after mounting   
            enablePrefill();
            setTopicState({...topicInitialState});
        // do before unmounting
        return () => {
            restoreState();
        };
      }, []); // passing empty array means do only once (https://reactjs.org/docs/hooks-effect.html)

    /***** PREFILL TOPIC FIELDS *****/
    useEffect(() => {
        function preFillForm(itemId) {
            console.log("preFillForm", itemId)
            var tpc = {...topicInitialState};
            topics.forEach(topic => {
            if (itemId === topic.id) {
                console.log("preFillForm: found it!", topic);
                setUseUpdate(true);
                tpc = {...topic};
            }
            });
            setTopicState({...tpc});

        };


        if (usePrefill && itemId) {
            preFillForm(itemId);
        }
    }, [itemId, topics, usePrefill]);

    /***** PREFILL VOTING OPTION FIELDS *****/
    useEffect(() => {

        const idArray = topicState.voting_options;
        console.log("idArray length: ", idArray.length);

        const fetchData = async () => {

            //create filter for fetching the needed voting options
            const filter = {or: []}
            idArray.forEach(element => {
                const criteria = {eq: element};
                const query = {id: criteria};
                filter.or = [...filter.or, query];
            });  
            console.log("FILTER: ", filter);
    
            //fetch the needed voting options
            const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions, {filter:filter}))
            const votingOptions = votingOptionData.data.listVotingOptions.items
            setVotingOptions([...votingOptions])
       
            console.log("prefillVotingOptions", votingOptions);
            var cats = [];
            votingOptions.forEach(element => {
                const cat = { votingOptionId: element.id, catNumber: element.option_number, catText: element.option_text };
                cats = [...cats, {...cat}]
            });
            setCats(cats);
        };
       
        if (idArray.length>0) { //attempt to fetch with empty filter will cause DynamoDB error
            fetchData();
        }
        
    }, [topicState.voting_options]);

    function restoreState() {
        setUsePrefill(true);
        setUseUpdate(false);
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
            //console.log("ZZZ fetchTopics2: ", topics);

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
        
        let index = 0;
        topic.voting_options = [];
        catState.forEach(element => 
            {
                console.log("foreach: ", index, element.catNumber, element.catText);
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    composeNewVotingOption(index++);
                    topic.voting_options = [...topic.voting_options, votingOptionToAdd.id]
                    addVotingOption();
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic});
        setTopics([...topics, topic]);

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
        
        let index = 0;
        topic.voting_options = [];
        catState.forEach(element => 
            {
                console.log("foreach: ", index, element.catNumber, element.catText);
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    if (element.votingOptionId) {
                        composeOldVotingOption(index++, element.votingOptionId);
                        topic.voting_options = [...topic.voting_options, element.votingOptionId];
                        updVotingOption();
                    }
                    else {
                        composeNewVotingOption(index++);
                        topic.voting_options = [...topic.voting_options, votingOptionToAdd.id]
                        addVotingOption();
                    } 
                }
                else {
                    console.log("foreach skipping: ", index, element.catNumber, element.catText);
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic});
        setTopics([...topics, topic]);

        await API.graphql(graphqlOperation(updateTopic, {input: topic}));

        updateTopicsList();
        clearState();

    } catch (err) {
            console.log('error creating topic:', err);
        }
    }

    function disablePrefill() {
        setUsePrefill(false);
    }

    function enablePrefill() {
        setUsePrefill(true);
    }

    const handleDelete = (event) => {
        let id = event.target.getAttribute('id'); 
        let num = event.target.getAttribute('num'); 
        console.log("handleDelete", id);

        if (id === '') {
            console.log("handleDelete CAT1:", num, parseInt(num));
            //const cats = [...catState.filter(item => item.catNumber !== num)];
            const cats = catState.filter(item => item.catNumber !== parseInt(num));
            console.log("handleDelete CAT3", cats);
            setCats(cats);
        }

        const topic = { ...topicState }
        if (topic.voting_options_count === 1) {
            topic.voting_options = [];
            clearCatState();
        }
        else {
            topic.voting_options = topic.voting_options.filter(item => item !== id);
            topic.voting_options_count = topic.voting_options.length;
        }
        setTopicState({ ...topic});

        console.log("handleDelete catState", catState);
        console.log("handleDelete votingOptions", votingOptions);
        console.log("handleDelete topicState.voting_options", topicState.voting_options);


    }

/** UI */

    function setInput(key, value) {
        setTopicState({ ...topicState, [key]: value })
    }

    return(   
        /*isLoading ? (
            <div>Loading ...</div>
          ) : (*/
        <div style={styles.container}>
            <h3>Topic</h3>
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
            
            <h5>Voting options</h5>
           {
            catState.map((val, idx) => (
                <div key={"containerBox" + idx} style={styles.rowcontainer}>
                    <CatInputs
                        onFocus={disablePrefill}
                        style={styles.input3}
                        key={`cat-${idx}`}
                        idx={idx}
                        catState={catState}
                        handleCatChange={handleCatChange}
                    />
                    <button style={styles.button2} id={val.votingOptionId} num={val.catNumber} 
                        onClick={handleDelete}>Delete</button>
                </div>

            ))
            }
             <button style={styles.button} onFocus={disablePrefill} onClick={addBlankCat}>Add voting option</button> 
            
                
            {
            useUpdate
            ?
            <button style={styles.button} onClick={updTopic}>Update Topic</button>
            :
            <button style={styles.button} onClick={addTopic}>Create Topic</button>
            }
        
        </div>
       /* )  */
    )  
}

TopicsData.propTypes = {
    itemId: PropTypes.string,
    updateTopicsList: PropTypes.func,
}


const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    rowcontainer: { alignItems: 'right', color: 'black', backgroundColor:'#ddd', width: 396, margin: '0 0', display: 'flex', flexDirection: 'row', padding: 2 },
    input: { border: 'none', backgroundColor: 'white', marginBottom: 2, padding: 8, fontSize: 12 },
    inputDisabled: { color: 'grey', border: 'none', backgroundColor: '#bbb', marginBottom: 2, padding: 8, fontSize: 12 },
    input3: { border: 'none', backgroundColor: 'white', marginBottom: 0, padding: 8, fontSize: 12 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 2, marginBottom: 8, padding: '12px 0px' },
    button2: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 0, marginBottom: 0, padding: '10 8' }
}

export default TopicsData;