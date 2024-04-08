import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($unionID: UnifiedID!, $message: MessageInput) {
    newMessage(unionID: $unionID, message: $message) {
      id
      chatID
      content
      sender {
        firstName
        lastName
      }
      createdAt
    }
  }
`;

export const REMOVE_USER = gql`
  mutation removeChatUser(
    $unionID: UnifiedID!
    $chatID: UnifiedID!
    $userID: UnifiedID!
  ) {
    removeChatUser(unionID: $unionID, chatID: $chatID, userID: $userID)
  }
`;
