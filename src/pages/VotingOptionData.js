import React from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import PropTypes from 'prop-types';

import { createVotingOption } from '../graphql/mutations'
import { listVotingOptions } from '../graphql/queries'
import { TopicData } from './TopicsData'

import '../App.css';

const votingOptionInitialState = {
    topic_id: '',
    topic_number: '',
    id: '',
    option_number: 0,
    option_text: '',
    votes: 0,
    unanimously_selected: false,
}

/*
const VotingOptionData = () => {
    
    const [votingOptionFormState, setVotingOptionFormState] = useState(votingOptionInitialState)
    const [votingOptions, setVotingOptions] = useState([])

    useEffect(() => {
        fetchVotingOptions()
    }, [])

    function setInput(key, value) {
        setVotingOptionFormState({ ...votingOptionFormState, [key]: value })
    }

    async function fetchVotingOptions() {
        try {
            const votingOptionData = await API.graphql(graphqlOperation(listVotingOptions))
            const votingOptions = votingOptionData.data.listVotingOptions.items
            setVotingOptions(votingOptions)
        } catch (err) { console.log('error fetching votingOptions') }
    }

    async function addVotingOption() {
        try {
            if (!votingOptionFormState.id || !votingOptionFormState.votingOption_number) {
                console.log('error creating votingOption: ID = ',votingOptionFormState.id);
                console.log('error creating votingOption: title = ',votingOptionFormState.votingOption_title);
                return
            }
            const votingOption = { ...votingOptionFormState }
            console.log('creating votingOption:', votingOption)
            setVotingOptions([...votingOptions, votingOption])
            setVotingOptionFormState(votingOptionInitialState)
            await API.graphql(graphqlOperation(createVotingOption, {input: votingOption}))
        } catch (err) {
            console.log('error creating votingOption:', err)
        }
    }

}
*/
const VotingOptionData = () => {

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
addVotingOptions.propTypes = {
    //idx: PropTypes.number,
    topicState: PropTypes.array,
    catState: PropTypes.array,
    //handleCatChange: PropTypes.func,
};
function addVotingOptions(topicState, catState) {
    votingOptionToAdd.topic_id = topicState.id; 
    votingOptionToAdd.topic_number = topicState.topic_number; 
    votingOptionToAdd.id = topicState.id + '-' + topicState.topic_number;
    votingOptionToAdd.option_number = catState.name;
    votingOptionToAdd.option_text = catState.age;
    votingOptionToAdd.votes = 0;
    votingOptionToAdd.unanimously_selected = true;

        /*
        VotingOptionData.setState({ 
            topic_id: topicState.id
        });
        */

        addVotingOption();
    }
}


export default VotingOptionData