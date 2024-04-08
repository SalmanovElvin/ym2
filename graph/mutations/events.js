import { gql } from '@apollo/client';

export const SCAN_MEMBER = gql`
  mutation checkBarcode(
    $unionID: UnifiedID!
    $trackerID: UnifiedID!
    $barcode: String!
    $captainUserID: UnifiedID!
    $checkIn: Boolean!
  ) {
    checkBarcode(
      unionID: $unionID
      trackerID: $trackerID
      barcode: $barcode
      captainUserID: $captainUserID
      checkIn: $checkIn
    ) {
      id
      firstName
      lastName
    }
  }
`;
