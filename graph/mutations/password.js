import { gql } from '@apollo/client';

export const REQUEST_PASSWORD_RESET = gql`
  mutation requestPasswordReset($unionID: UnifiedID!, $username: String!) {
    requestPasswordReset(unionID: $unionID, username: $username)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetPassword(
    $unionID: UnifiedID!
    $uuidKey: String!
    $newPassword: String!
  ) {
    resetPassword(
      unionID: $unionID
      uuidKey: $uuidKey
      newPassword: $newPassword
    )
  }
`;
