import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import CatInputs from './CatInputs';

import '../App.css';
import { generateId, getSelectedMeeting } from '../App'
import { getListedTopics } from './TopicsList'

import { API, graphqlOperation } from 'aws-amplify'
import {  getMeeting, listTopics, listVotingOptions } from '../graphql/queries'

import { updateMeeting, createTopic, updateTopic  } from '../graphql/mutations'
import { createVotingOption, updateVotingOption, deleteVotingOption} from '../graphql/mutations'


export const topicInitialState = {
    id: '',
    topic_number: '',
    topic_title: '',
    topic_text: '',
    voting_options: [...''],
    voting_options_count: 0,
    active: false,
    voting_percentage: 0.0,
}

export const votingOptionInitialState = {
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

    async function addUpdateMeetingData(id) {
        let ret = null;
        try {
            const mtg = await API.graphql(graphqlOperation(getMeeting, {id: selectedMeeting.id}));
            let meeting = {...mtg.data.getMeeting}
            listedTopics = [...listedTopics, topicState.id];
            meeting.topics = [...listedTopics];
            ret = await API.graphql(graphqlOperation(updateMeeting, {input: meeting}));
        } catch (err) { console.log('error updating meeting:', err) }
        return ret;
    }

/** Cat */
    const blankCat = { votingOptionId: '', catNumber: '', catText: '', catVotes: 0, changed: false };
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
        updatedCats[e.target.dataset.idx].changed = true;
        console.log("updated cats", updatedCats)
        setCatState(updatedCats);
    };

/** Voting options */
    const votingOptionToAdd = { ...votingOptionInitialState }

    async function addVotingOptionToDb() {
        let ret = null;
        try {
            if (!(votingOptionToAdd.id)) {
                console.log('error creating votingOption:',votingOptionToAdd);
                return
            }
            const votingOption = { ...votingOptionToAdd }
            ret = await API.graphql(graphqlOperation(createVotingOption, {input: votingOption}))
        } catch (err) {
            console.log('error creating votingOption:', err)
        }
        return ret;
    }

    async function updVotingOptionToDb() {
        let ret = null;
        try {
            if (!(votingOptionToAdd.id)) {
                console.log('error creating votingOption:',votingOptionToAdd);
                return
            }
            const votingOption = { ...votingOptionToAdd }
            if (votingOption.unanimously_selected) {
                votingOption.unanimously_selected = false;
                ret = await API.graphql(graphqlOperation(updateVotingOption, {input: votingOption}))
            }
        } catch (err) {
            console.log('error updating votingOption:', err)
        }
        return ret;
    }

    function composeVotingOption(idx, id) {
        votingOptionToAdd.topic_id = topicState.id; 
        votingOptionToAdd.topic_number = topicState.topic_number; 
        votingOptionToAdd.id = id;
        votingOptionToAdd.option_number = catState[idx].catNumber;
        votingOptionToAdd.option_text = catState[idx].catText;
//        votingOptionToAdd.votes = 0;
        votingOptionToAdd.votes = catState[idx].catVotes;
        votingOptionToAdd.unanimously_selected = catState[idx].changed;
//        votingOptionToAdd.unanimously_selected = false;

        return votingOptionToAdd;
    }

/** Topics */
    const [topicState, setTopicState] = useState(topicInitialState)
    const [topics, setTopics] = useState([])

    const [usePrefill, setUsePrefill] = useState(false);
    const [useUpdate, setUseUpdate] = useState(false);
    const [cbfunc, setCbFunc] = useState(false);


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
    }, []);

    useEffect(() => {
        if (cbfunc) {
            setTimeout(() => {
                updateTopicsList(); 
         }, 1500);
    }
    }, [cbfunc, updateTopicsList]);


    /***** PREFILL TOPIC FIELDS *****/
    useEffect(() => {
        function preFillForm(itemId) {
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
        } else if (!itemId) {
            console.log("ITEMID", itemId)
            var tpc = {...topicInitialState};
            tpc.id = generateId();
            setTopicState({...tpc});
        }
    }, [itemId, topics, usePrefill]);

    /***** PREFILL VOTING OPTION FIELDS *****/
    useEffect(() => {

        const idArray = topicState.voting_options;

        const fetchData = async () => {
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
                    const cat = { votingOptionId: element.id, catNumber: element.option_number, catText: element.option_text, catVotes: element.votes };
                    cats = [...cats, {...cat}]
                });
                setCats(cats);
                return votingOptionData;
            } catch (error) {
                console.log("Error fetching voting options:", error);
            }
        };
       
        if (usePrefill && idArray.length>0) { //attempt to fetch with empty filter will cause DynamoDB error
            fetchData();
        }
        
    }, [topicState.voting_options, usePrefill]);

    function restoreState() {
        setUsePrefill(true);
        setUseUpdate(false);
    }

    async function fetchTopics() {
        let ret = null;
        try {
            const topicData = await API.graphql(graphqlOperation(listTopics))
            const topics = topicData.data.listTopics.items
            setTopics(topics)
            ret = topics
        } catch (err) { 
            console.log('error fetching topics') 
        }
        return ret
    }

    async function addTopic() { // 'Create topic' button clicked
        let ret = null;
        try {
        if (!topicState.id || !topicState.topic_number) {
            console.log('error creating topic:',topicState);
            return
        }
        const topic = { ...topicState }
        
        let index = 0;
        topic.voting_options = [];
        catState.forEach(element => 
            {
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    composeVotingOption(index++, generateId());
                    topic.voting_options = [...topic.voting_options, votingOptionToAdd.id]
                    addVotingOptionToDb();
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic });
        setTopics([...topics, topic]);

        // add the new topic to meeting topics list for selected meeting and update DynamoDB table
        addUpdateMeetingData(topic.id); 

        // This will execute the callback and return to TopicsList if db operation succeeded
        setCbFunc( ret = await API.graphql(graphqlOperation(createTopic, {input: topic})));
           
        } catch (err) {
            console.log('error creating topic:', err);
        }
        return ret;
    }

    async function updTopic() { // 'Update topic' button clicked
        let ret = null;
        try {
        if (!topicState.id || !topicState.topic_number) {
            console.log('error creating topic:',topicState);
            return
        }
        const topic = { ...topicState }
        
        let index = 0;
        topic.voting_options = [];
        catState.forEach(element => 
            {
                if ((element.catNumber>0) && (element.catText.length>0)) {
                    if (element.votingOptionId) {
                        composeVotingOption(index++, element.votingOptionId);
                        topic.voting_options = [...topic.voting_options, element.votingOptionId];
                        updVotingOptionToDb();
                    }
                    else {
                        composeVotingOption(index++, generateId());
                        topic.voting_options = [...topic.voting_options, votingOptionToAdd.id]
                        addVotingOptionToDb();
                    } 
                }
                else {
                    console.log("skipping cat: ", index, element.catNumber, element.catText);
                }
            })

        topic.voting_options_count = index;
        setTopicState({ ...topic});
        setTopics([...topics, topic]);

        // This will execute the callback and return to TopicsList if db operation succeeded
        setCbFunc( ret = await API.graphql(graphqlOperation(updateTopic, {input: topic})));

        } catch (err) {
            console.log('error creating topic:', err);
        }
        return ret;
    }

    function disablePrefill() {
        setUsePrefill(false);
    }

    function enablePrefill() {
        setUsePrefill(true);
    }

    async function handleDelete(event) {
    //const handleDelete = (event) => {
        let id = event.target.getAttribute('id'); 
        let num = event.target.getAttribute('num'); 

        if (id === '') {
            const cats = catState.filter(item => item.catNumber !== parseInt(num));
            setCats(cats);
        }

        var topic = { ...topicState }
        if (topic.voting_options_count === 1) {
            topic.voting_options = [];
            clearCatState();
        }
        else {
            try {
                const vo = { id: id }
                await API.graphql(graphqlOperation(deleteVotingOption, {input: vo}))
            } catch (error) {
                console.log("Error deleting from DynamoDb table", error); 
            }
            
            try {
                topic.voting_options = topic.voting_options.filter(item => item !== id);
                topic.voting_options_count = topic.voting_options.length;
                await API.graphql(graphqlOperation(updateTopic, {input: topic}))
            } catch (error) {
                console.log("Error updating topic to DynamoDb table", error); 
            }
            
        }
        setTopicState({ ...topic });

    }

/** UI */

    function setInput(key, value) {
        setTopicState({ ...topicState, [key]: value })
    }
    
    return( 
        cbfunc ? (
            <div style={styles.info}>
                <p/>
                <div>Loading ...</div>
            </div>
        ) : (  
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
    )
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
    info: { justifyContent: 'center', color: 'white', outline: 'none', fontSize: 12, padding: '4px 4px' },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 2, marginBottom: 8, padding: '12px 0px' },
    button2: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 0, marginBottom: 0, padding: '10 8' }
}

export default TopicsData;