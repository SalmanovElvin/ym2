import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query getTracker($unionID: UnifiedID!, $trackerType: String) {
    getTracker(unionID: $unionID, trackerType: $trackerType) {
      id
      title
      startDate
      endDate
      active
      type
      unit
    }
  }
`;

export const GET_CAPTAINS = gql`
  query getCaptains($unionID: UnifiedID!, $trackerID: UnifiedID!) {
    getCaptains(unionID: $unionID, trackerID: $trackerID) {
      id
      userID
      trackerID
    }
  }
`;

export const CHECK_CAPTAIN = gql`
  query singleMember(
    $unionID: UnifiedID!
    $trackerID: UnifiedID!
    $memberID: UnifiedID!
  ) {
    singleMember(
      unionID: $unionID
      trackerID: $trackerID
      memberID: $memberID
    ) {
      id
      isCaptain
      trackerID
      shiftData {
        id
        date
        locationID
        locationTitle
        startShift
        endShift
      }
      dates {
        date
        checkedIn
        checkedOut
        checkedInBy
        checkedOutBy
        checkedInByName
        checkedOutByName
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query singleMember(
    $unionID: UnifiedID!
    $trackerID: UnifiedID!
    $memberID: UnifiedID!
  ) {
    singleMember(
      unionID: $unionID
      trackerID: $trackerID
      memberID: $memberID
    ) {
      id
      userID
      trackerID
      firstName
      lastName
      isCaptain
      shiftData {
        id
        memberID
        date
        locationID
        locationTitle
        startShift
        endShift
      }
      dates {
        date
        checkedIn
        checkedOut
        checkedInBy
        checkedOutBy
        checkedInByName
        checkedOutByName
      }
    }
  }
`;

export const CHECKED_IN = gql`
  query isCheckedInTracker(
    $unionID: UnifiedID!
    $trackerID: UnifiedID!
    $barcode: String!
  ) {
    isCheckedInTracker(
      unionID: $unionID
      trackerID: $trackerID
      barcode: $barcode
    ) {
      checkedIn
      checkInDate
      firstName
      lastName
      profileImage
    }
  }
`;
