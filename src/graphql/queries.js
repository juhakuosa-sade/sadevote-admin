/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
      }
      nextToken
    }
  }
`;
export const getMeeting = /* GraphQL */ `
  query GetMeeting($id: ID!) {
    getMeeting(id: $id) {
      id
      name
      description
      admins
      users
      topics
    }
  }
`;
export const listMeetings = /* GraphQL */ `
  query ListMeetings(
    $filter: ModelMeetingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMeetings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        admins
        users
        topics
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      firstname
      lastname
      shares
      present
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        email
        firstname
        lastname
        shares
        present
      }
      nextToken
    }
  }
`;
export const getTopic = /* GraphQL */ `
  query GetTopic($id: ID!) {
    getTopic(id: $id) {
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
export const listTopics = /* GraphQL */ `
  query ListTopics(
    $filter: ModelTopicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        topic_number
        topic_title
        topic_text
        voting_options
        voting_options_count
        active
        voting_percentage
      }
      nextToken
    }
  }
`;
export const getVotingOption = /* GraphQL */ `
  query GetVotingOption($id: ID!) {
    getVotingOption(id: $id) {
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
export const listVotingOptions = /* GraphQL */ `
  query ListVotingOptions(
    $filter: ModelVotingOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVotingOptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        topic_id
        topic_number
        id
        option_number
        option_text
        votes
        unanimously_selected
      }
      nextToken
    }
  }
`;
