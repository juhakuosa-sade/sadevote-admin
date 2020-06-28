/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $input: CreateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    createTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $input: UpdateTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    updateTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $input: DeleteTodoInput!
    $condition: ModelTodoConditionInput
  ) {
    deleteTodo(input: $input, condition: $condition) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const createMeeting = /* GraphQL */ `
  mutation CreateMeeting(
    $input: CreateMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    createMeeting(input: $input, condition: $condition) {
      id
      name
      description
      admins
      users
      topics
      active
      createdAt
      updatedAt
    }
  }
`;
export const updateMeeting = /* GraphQL */ `
  mutation UpdateMeeting(
    $input: UpdateMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    updateMeeting(input: $input, condition: $condition) {
      id
      name
      description
      admins
      users
      topics
      active
      createdAt
      updatedAt
    }
  }
`;
export const deleteMeeting = /* GraphQL */ `
  mutation DeleteMeeting(
    $input: DeleteMeetingInput!
    $condition: ModelMeetingConditionInput
  ) {
    deleteMeeting(input: $input, condition: $condition) {
      id
      name
      description
      admins
      users
      topics
      active
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      firstname
      lastname
      shares
      present
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      firstname
      lastname
      shares
      present
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      firstname
      lastname
      shares
      present
      createdAt
      updatedAt
    }
  }
`;
export const createTopic = /* GraphQL */ `
  mutation CreateTopic(
    $input: CreateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    createTopic(input: $input, condition: $condition) {
      id
      topic_number
      topic_title
      topic_text
      voting_options
      voting_options_count
      voting_open
      active
      voting_percentage
      createdAt
      updatedAt
    }
  }
`;
export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic(
    $input: UpdateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    updateTopic(input: $input, condition: $condition) {
      id
      topic_number
      topic_title
      topic_text
      voting_options
      voting_options_count
      voting_open
      active
      voting_percentage
      createdAt
      updatedAt
    }
  }
`;
export const deleteTopic = /* GraphQL */ `
  mutation DeleteTopic(
    $input: DeleteTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    deleteTopic(input: $input, condition: $condition) {
      id
      topic_number
      topic_title
      topic_text
      voting_options
      voting_options_count
      voting_open
      active
      voting_percentage
      createdAt
      updatedAt
    }
  }
`;
export const createVotingOption = /* GraphQL */ `
  mutation CreateVotingOption(
    $input: CreateVotingOptionInput!
    $condition: ModelVotingOptionConditionInput
  ) {
    createVotingOption(input: $input, condition: $condition) {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      changed
      createdAt
      updatedAt
    }
  }
`;
export const updateVotingOption = /* GraphQL */ `
  mutation UpdateVotingOption(
    $input: UpdateVotingOptionInput!
    $condition: ModelVotingOptionConditionInput
  ) {
    updateVotingOption(input: $input, condition: $condition) {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      changed
      createdAt
      updatedAt
    }
  }
`;
export const deleteVotingOption = /* GraphQL */ `
  mutation DeleteVotingOption(
    $input: DeleteVotingOptionInput!
    $condition: ModelVotingOptionConditionInput
  ) {
    deleteVotingOption(input: $input, condition: $condition) {
      topic_id
      topic_number
      id
      option_number
      option_text
      votes
      changed
      createdAt
      updatedAt
    }
  }
`;
export const createVoting = /* GraphQL */ `
  mutation CreateVoting(
    $input: CreateVotingInput!
    $condition: ModelVotingConditionInput
  ) {
    createVoting(input: $input, condition: $condition) {
      id
      votingOptionId
      votes
      voter
      createdAt
      updatedAt
    }
  }
`;
export const updateVoting = /* GraphQL */ `
  mutation UpdateVoting(
    $input: UpdateVotingInput!
    $condition: ModelVotingConditionInput
  ) {
    updateVoting(input: $input, condition: $condition) {
      id
      votingOptionId
      votes
      voter
      createdAt
      updatedAt
    }
  }
`;
export const deleteVoting = /* GraphQL */ `
  mutation DeleteVoting(
    $input: DeleteVotingInput!
    $condition: ModelVotingConditionInput
  ) {
    deleteVoting(input: $input, condition: $condition) {
      id
      votingOptionId
      votes
      voter
      createdAt
      updatedAt
    }
  }
`;
