import { gql } from '@apollo/client';

export const GET_ELECTIONS = gql`
  query elections($unionID: UnifiedID!) {
    elections(unionID: $unionID) {
      id
      title
      description
      startDate
      endDate
      deleted
      ballots {
        title
        ballotFilters {
          name
          params
        }
      }
    }
  }
`;

export const GET_ELECTIONS_TITLE = gql`
  query elections($unionID: UnifiedID!) {
    elections(unionID: $unionID) {
      id
      title
      endDate
    }
  }
`;

export const SINGLE_ELECTION = gql`
  query singleElection($unionID: UnifiedID!, $electionID: UnifiedID!) {
    singleElection(unionID: $unionID, electionID: $electionID) {
      id
      title
      description
      question
      options {
        id
        title
        imageURL
      }
      status
      startDate
      endDate
      memberIDs
      votes
      unit
    }
  }
`;

export const FETCH_BALLOTS = gql`
  query ballots($unionID: UnifiedID!, $electionID: UnifiedID!) {
    ballots(unionID: $unionID, electionID: $electionID) {
      id
      electionID
      title
      options {
        id
        title
        name
        description
        imageURL
        videoURL
      }
      memberIDs
      votes
      allowAbstain
      allowAbstainType
      choiceType
      choiceLimit
      choiceMin
      choiceMax
      orderPosition
      ballotFilters {
        name
        params
      }
    }
  }
`;

export const SINGLE_BALLOT = gql`
  query ballots($unionID: UnifiedID!, $electionID: UnifiedID!) {
    ballots(unionID: $unionID, electionID: $electionID) {
      id
      electionID
      title
      options {
        id
        title
        name
        description
        imageURL
        videoURL
      }
      memberIDs
      votes
      allowAbstain
      allowAbstainType
      choiceType
      choiceLimit
      choiceMin
      choiceMax
      orderPosition
      ballotFilters {
        name
        params
      }
    }
  }
`;

export const ELECTION_REPORT = gql`
  query electionReport(
    $unionID: UnifiedID!
    $electionID: UnifiedID!
    $ballotID: UnifiedID
    $reportType: String
  ) {
    electionReport(
      unionID: $unionID
      electionID: $electionID
      ballotID: $ballotID
      reportType: $reportType
    ) {
      id
      ballotID
      respondentID
      imageURL
      optionID
      respondedAt
      mode
      ipAddress
      userAgent
      respondent {
        id
        firstName
        lastName
        unit
      }
      votedFor {
        name
        title
      }
      recieptID
      abstained
    }
  }
`;

export const ELECTION_REPORT_BY_USER = gql`
  query electionReportByUser(
    $unionID: UnifiedID!
    $electionID: UnifiedID!
    $ballotID: UnifiedID
    $reportType: String
  ) {
    electionReportByUser(
      unionID: $unionID
      electionID: $electionID
      ballotID: $ballotID
      reportType: $reportType
    ) {
      id
      ballotID
      respondentID
      imageURL
      optionID
      respondedAt
      mode
      ipAddress
      userAgent
      ballot {
        title
        ballotFilters {
          name
          params
        }
        options {
          id
          title
          name
        }
        choiceType
        choiceLimit
        choiceMin
        choiceMax
      }
      respondent {
        id
        firstName
      }
      votedFor {
        name
      }
      recieptID
    }
  }
`;

export const MY_VOTE = gql`
  query myVote(
    $unionID: UnifiedID!
    $electionID: UnifiedID!
    $receiptID: String!
  ) {
    myVote(unionID: $unionID, electionID: $electionID, receiptID: $receiptID) {
      id
      ballotID
      respondentID
      imageURL
      optionID
      respondedAt
      mode
      ipAddress
      userAgent
      respondent {
        id
        firstName
        lastName
      }
      votedFor {
        title
      }
      recieptID
      abstained
    }
  }
`;

export const ELECTIONS_FOR_USER = gql`
  query electionsForUser {
    electionsForUser {
      id
      title
      description
      startDate
      endDate
      deleted
    }
  }
`;
