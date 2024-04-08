import { gql } from '@apollo/client';

export const NEW_ELECTION = gql`
  mutation newElection($unionID: UnifiedID!, $input: ElectionInput) {
    newElection(unionID: $unionID, input: $input) {
      id
      title
      description
      question
      options {
        title
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

export const VOTE_ME = gql`
  mutation vote(
    $unionID: UnifiedID!
    $electionID: UnifiedID!
    $ballotID: UnifiedID!
    # $userID: UnifiedID!
    $votedFor: [UnifiedID]!
    $mode: String!
  ) {
    vote(
      unionID: $unionID
      electionID: $electionID
      ballotID: $ballotID
      # userID: $userID
      votedFor: $votedFor
      mode: $mode
    )
  }
`;

export const SUBMIT_VOTE = gql`
  mutation kioskVote(
    $unionID: UnifiedID!
    $electionID: UnifiedID!
    $votes: [VoteInput!]!
    $image: Upload
    $mode: String
  ) {
    kioskVote(
      unionID: $unionID
      electionID: $electionID
      votes: $votes
      image: $image
      mode: $mode
    )
  }
`;

export const SEND_EMAIL = gql`
  mutation sendEmail(
    $email: [String!]
    $sender: String!
    $subject: String!
    $content: String!
  ) {
    sendEmail(
      email: $email
      sender: $sender
      subject: $subject
      content: $content
    )
  }
`;
