import { gql } from '@apollo/client';

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar(
    $unionID: UnifiedID!
    $file: Upload!
    $userID: UnifiedID!
  ) {
    uploadAvatar(unionID: $unionID, file: $file, userID: $userID)
  }
`;

export const UPLOAD_DOCUMENT = gql`
  mutation uploadDocument(
    $unionID: UnifiedID!
    $file: Upload!
    $docInfo: DocInfo
  ) {
    uploadDocument(unionID: $unionID, file: $file, docInfo: $docInfo)
  }
`;
