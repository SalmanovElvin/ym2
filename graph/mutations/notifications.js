import { gql } from '@apollo/client';

export const MARK_NOTIFICATION = gql`
  mutation markNotificationAsRead(
    $unionID: UnifiedID!
    $notificationID: UnifiedID!
    $userID: UnifiedID!
  ) {
    markNotificationAsRead(
      unionID: $unionID
      notificationID: $notificationID
      userID: $userID
    )
  }
`;
// Login graphql mutation
export const DELETE_USER_NOTIFICATION = gql`
  mutation deleteUserNotification(
    $unionID: UnifiedID!
    $notificationID: UnifiedID!
    $userID: UnifiedID!
  ) {
    deleteUserNotification(
      unionID: $unionID
      notificationID: $notificationID
      userID: $userID
    )
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteAdminNotification(
    $unionID: UnifiedID!
    $notificationID: UnifiedID!
  ) {
    deleteNotification(unionID: $unionID, notificationID: $notificationID)
  }
`;

export const SEND_NOTIFICATION = gql`
  mutation SendNotification(
    $unionID: UnifiedID!
    $notification: NotificationInput
  ) {
    newNotification(unionID: $unionID, notification: $notification)
  }
`;

export const REGISTER_NOTIFICATION=gql`
mutation registerForPushNotification(
  $unionID:UnifiedID!
  $userID:UnifiedID!
  $pushToken:String!
){
  registerForPushNotification(
    unionID:$unionID
    userID:$userID
    pushToken:$pushToken
  )
}
`;

export const LOGOUT_TOKEN=gql`
mutation deRegisterPushNotification(
  $unionID:UnifiedID!
  $userID:UnifiedID!
  $pushToken:String
){
  deRegisterPushNotification(
    unionID:$unionID
    userID:$userID
    pushToken:$pushToken
  )
}
`;

export const READ_NOTIFICATION_ALL = gql`
 	mutation markNotificationsAsRead($notificationID: [UnifiedID!]!) {
 		markNotificationsAsRead(notificationID: $notificationID)
 	}
`;