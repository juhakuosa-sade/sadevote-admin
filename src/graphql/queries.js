/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
      active
      createdAt
      updatedAt
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
        active
        createdAt
        updatedAt
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
      createdAt
      updatedAt
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
        createdAt
        updatedAt
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
      voting_open
      active
      voting_percentage
      createdAt
      updatedAt
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
        voting_open
        active
        voting_percentage
        createdAt
        updatedAt
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
      changed
      createdAt
      updatedAt
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
        changed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVoting = /* GraphQL */ `
  query GetVoting($id: ID!) {
    getVoting(id: $id) {
      id
      votingOptionId
      votes
      voter
      createdAt
      updatedAt
    }
  }
`;
export const listVotings = /* GraphQL */ `
  query ListVotings(
    $filter: ModelVotingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVotings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        votingOptionId
        votes
        voter
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
