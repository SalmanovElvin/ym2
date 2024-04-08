import { gql } from '@apollo/client';

export const SEND_TEXT_BLAST = gql`
  mutation SendTextBlast(
    $unionID: UnifiedID!
    $users: [UnifiedID!]
    $message: String!
    $subject: String
  ) {
    sendTextBlast(
      unionID: $unionID
      users: $users
      message: $message
      subject: $subject
    )
  }
`;
