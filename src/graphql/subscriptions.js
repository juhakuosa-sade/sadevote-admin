/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
      id
      name
      description
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
      id
      name
      description
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
      id
      name
      description
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      email
      firstname
      lastname
      shares
      present
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      email
      firstname
      lastname
      shares
      present
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      email
      firstname
      lastname
      shares
      present
    }
  }
`;
export const onCreateTopic = /* GraphQL */ `
  subscription OnCreateTopic {
    onCreateTopic {
      id
      topic_number
      topic_title
      topic_text
      voting_options {
        topic_id
        topic_number
        id
        option_number
        option_text
        votes
        unanimously_selected
      }
      voting_options_count
      active
      voting_percentage
    }
  }
`;
export const onUpdateTopic = /* GraphQL */ `
  subscription OnUpdateTopic {
    onUpdateTopic {
      id
      topic_number
      topic_title
      topic_text
      voting_options {
        topic_id
        topic_number
        id
        option_number
        option_text
        votes
        unanimously_selected
      }
      voting_options_count
      active
      voting_percentage
    }
  }
`;
export const onDeleteTopic = /* GraphQL */ `
  subscription OnDeleteTopic {
    onDeleteTopic {
      id
      topic_number
      topic_title
      topic_text
      voting_options {
        topic_id
        topic_number
        id
        option_number
        option_text
        votes
        unanimously_selected
      }
      voting_options_count
      active
      voting_percentage
    }
  }
`;
export const onCreateVotingOption = /* GraphQL */ `
  subscription OnCreateVotingOption {
    onCreateVotingOption {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      unanimously_selected
    }
  }
`;
export const onUpdateVotingOption = /* GraphQL */ `
  subscription OnUpdateVotingOption {
    onUpdateVotingOption {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      unanimously_selected
    }
  }
`;
export const onDeleteVotingOption = /* GraphQL */ `
  subscription OnDeleteVotingOption {
    onDeleteVotingOption {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      unanimously_selected
    }
  }
`;
