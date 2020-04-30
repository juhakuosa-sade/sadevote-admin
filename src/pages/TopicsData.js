import React, { useEffect, useState } from 'react'
import CatInputs from './CatInputs';
import '../App.css';

import { API, graphqlOperation } from 'aws-amplify'
import { listTopics } from '../graphql/queries'
import { createTopic } from '../graphql/mutations'
import { createVotingOption } from '../graphql/mutations'
import { listVotingOptions } from '../graphql/queries'


const topicInitialState = {
    id: '',
    topic_number: '',
    topic_title: '',
    topic_text: '',
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

const TopicsData = () => {
    
    //************ */
    const blankCat = { name: '', age: '' };
    const [catState, setCatState] = useState([
        { ...blankCat },
    ]);

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
    //************ */

    const votingOptionToAdd = { ...votingOptionInitialState }

    async function fetchVotingOptions() {
        try {
            const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions))
            const votingOptions = votingOptionData.data.listVotingOptions.items
        } catch (err) { console.log('error fetching votingOptions') }
    }

    async function addVotingOption() {
        try {
            if (!votingOptionToAdd.id) {
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
        votingOptionToAdd.id = topicState.id + '-' + topicState.topic_number;
        votingOptionToAdd.option_number = catState[idx].name;
        votingOptionToAdd.option_text = catState[idx].age;
        votingOptionToAdd.votes = 0;
        votingOptionToAdd.unanimously_selected = true;
    }

    const [topicState, setTopicState] = useState(topicInitialState)
    const [topics, setTopics] = useState([])

    useEffect(() => {
        fetchTopics()
    }, [])

    function setInput(key, value) {
        setTopicState({ ...topicState, [key]: value })
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
        console.log('creating topic:', topic)
        console.log("addTopic:catState", {...catState});
        console.log("addTopic:catState.length:", catState.length);
        topic.voting_options_count = catState.length;
        setTopics([...topics, topic])
        setTopicState(topicInitialState)
        await API.graphql(graphqlOperation(createTopic, {input: topic}))

        catState.forEach(element => 
            {
                composeVotingOption(element.index);
                addVotingOption();
            })

        } catch (err) {
            console.log('error creating topic:', err)
        }
    }

    

    return (
       <div style={styles.container}>
        <h3>Topics</h3>
        <input
            onChange={event => setInput('id', event.target.value)}
            style={styles.input}
            value={topicState.id}
            placeholder="ID"
        />
        <input
            onChange={event => setInput('topic_number', event.target.value)}
            style={styles.input}
            value={topicState.topic_number}
            placeholder="Topic number"
        />
        <input
            onChange={event => setInput('topic_title', event.target.value)}
            style={styles.input}
            value={topicState.topic_title}
            placeholder="Title"
        />
        <textarea
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
             
        <button style={styles.button2} onClick={addTopic}>Create Topic</button>
        {
            topics.map((topic, index) => (

                <div key={topic.id ? topic.id : index} style={styles.topic}>
                    <p style={styles.topicName}>{topic.id} {topic.topic_number} {topic.topic_title}</p>
                    <p style={styles.topicDescription}>{topic.topic_text}</p>
                    <p style={styles.topicDescription}>{topic.voting_options}</p>
                </div>
            ))
        }
    </div>
    )

}

const styles = {
    container: { width: 400, margin: '0 0', display: 'flex', flexDirection: 'column', padding: 5 },
    topic: {  fontSize: 12, marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 12 },
    input2: { border: 'none', backgroundColor: '#ddd', marginBottom: 20, padding: 20, fontSize: 12 },
    topicName: { fontSize: 12, fontWeight: 'bold' },
    topicDescription: { fontSize: 12, marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginBottom: 10, padding: '12px 0px' },
    button2: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 12, marginTop: 10, marginBottom: 10, padding: '12px 0px' }
}

export default { TopicsData };