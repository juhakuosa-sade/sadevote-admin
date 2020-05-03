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
      active
      voting_percentage
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
      active
      voting_percentage
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
      active
      voting_percentage
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
      unanimously_selected
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
      unanimously_selected
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
      unanimously_selected
    }
  }
`;
