import { gql } from '@apollo/client';

//get user graphql query
export const GET_NOTIFICATIONS = gql`
  query notifications($unionID: UnifiedID!, $userID: UnifiedID!) {
    notifications(unionID: $unionID, userID: $userID) {
      id
      serviceID
      title
      message
      notificationType
      createdOn
      sender {
        id
        lastName
        firstName
        profile {
          imageURL
          email
          phone
        }
      }
      read
      readOn
      deleted
      deletedOn
    }
  }
`;

export const SET_BADGE = gql`
  query notifications($unionID: UnifiedID!, $userID: UnifiedID!) {
    notifications(unionID: $unionID, userID: $userID) {
      read
      deleted
    }
  }
`;

export const GET_SINGLE_NOTI = gql`
  query singleNotification(
    $unionID: UnifiedID!
    $userID: UnifiedID!
    $notificationID: UnifiedID!
  ) {
    singleNotification(
      unionID: $unionID
      userID: $userID
      notificationID: $notificationID
    ) {
      id
      serviceID
      title
      message
      notificationType
      createdOn
      sender {
        id
        lastName
        firstName
        profile {
          imageURL
          email
          phone
        }
      }
      read
      readOn
      deleted
      deletedOn
    }
  }
`;

export const PUSH_TOKEN = gql`
  query expoTokenExist(
    $unionID: UnifiedID!
    $userID: UnifiedID!
    $expoToken: String!
  ) {
    expoTokenExist(unionID: $unionID, userID: $userID, expoToken: $expoToken)
  }
`;
