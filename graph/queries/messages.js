import { gql } from '@apollo/client';

//get user graphql query
export const GET_CHATS = gql`
  query GetChats($unionID: UnifiedID!, $userID: UnifiedID!) {
    chats(unionID: $unionID, userID: $userID) {
      id
      participants {
        id
        lastName
        firstName
        profile {
          imageURL
        }
      }
      title
      lastMessage
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($unionID: UnifiedID!, $chatID: UnifiedID!) {
    messages(unionID: $unionID, chatID: $chatID) {
      id
      content
      sender {
        id
        firstName
        lastName
        profile {
          imageURL
        }
      }
      createdAt
    }
  }
`;

// export const CHAT_NOTIFICATIONS = gql`
//   query chatNotifications($unionID: UnifiedID!, $userID: UnifiedID!) {
//     chatNotifications(unionID: $unionID, userID: $userID) {
//       id
//       title
//       message
//       createdOn
//       sender {
//         id
//         firstName
//         lastName
//       }
//       read
//       readOn
//       deleted
//       deletedOn
//       serviceID
//     }
//   }
// `;

export const CHAT_NOTIFICATIONS = gql`
  query chatNotifications($unionID: UnifiedID!, $userID: UnifiedID!) {
    chatNotifications(unionID: $unionID, userID: $userID) {
      id
      title
      message
      notificationType
      read
      serviceID
      deleted
    }
  }
`;
