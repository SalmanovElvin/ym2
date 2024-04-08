import { gql } from '@apollo/client';

export const PASSWORD_RESET = gql`
  mutation requestPasswordReset($unionID: UnifiedID!, $username: String!) {
    requestPasswordReset(unionID: $unionID, username: $username)
  }
`;
