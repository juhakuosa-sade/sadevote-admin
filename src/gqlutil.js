export function makeMeetingInput(mtg) {
    const meeting = { 
        id: mtg.id,
        name: mtg.name, 
        description: mtg.description,
        admins:  [...mtg.admins],
        users:  [...mtg.users],
        topics:  [...mtg.topics],
        active: mtg.active
    }
    return meeting;
}

export function makeTopicInput(tpc) {
    const topic = {
        id: tpc.id,
        topic_number: tpc.topic_number,
        topic_title: tpc.topic_title,
        topic_text: tpc.topic_text,
        voting_options: [...tpc.voting_options],
        voting_options_count: tpc.voting_options_count,
        active: tpc.active,
        voting_percentage: tpc.voting_percentage,
    }
    return topic;
}

export function makeVotingOptionInput(vop) {
    const votingOption = {
        topic_id: vop.topic_id,
        topic_number: vop.topic_number,
        id: vop.id,
        option_number: vop.option_number,
        option_text: vop.option_text,
        votes: vop.votes,
        changed: vop.changed,
    }
    return votingOption;
}

export function makeUserInput(usr) {
    const user = {
        id: usr.id,
        email: usr.email,
        firstname: usr.firstname,
        lastname: usr.lastname,
        shares: usr.shares,
        present: usr.present
    }
    return user;
}
