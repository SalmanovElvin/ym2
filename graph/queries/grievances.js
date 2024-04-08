import { gql } from '@apollo/client';

export const GET_GRIEVANCES = gql`
  query grievances($unionID: UnifiedID!) {
    grievances(unionID: $unionID) {
      id
      members {
        id
        firstName
        lastName
        unit
      }
      witness {
        id
        firstName
        lastName
      }
      title
      details
      createdAt
      lastUpdatedAt
      status
      caseNumber
      unit
      steward {
        id
        memberID
        firstName
        lastName
        unit
      }
      subSteward {
        id
        memberID
        firstName
        lastName
        unit
      }
    }
  }
`;

export const GET_GRIEVANCES_FOR = gql`
  query grievancesFor($unionID: UnifiedID!, $userID: UnifiedID!) {
    grievancesFor(unionID: $unionID, userID: $userID) {
      id
      members {
        id
        firstName
        lastName
        unit
      }
      witness {
        id
        firstName
        lastName
      }
      title
      details
      createdAt
      lastUpdatedAt
      status
      caseNumber
      unit
      steward {
        id
        memberID
        firstName
        lastName
        unit
      }
      subSteward {
        id
        memberID
        firstName
        lastName
        unit
      }
    }
  }
`;


export const GET_SINGLE_GRIEVANCE = gql`
  query singleGrievance($unionID: UnifiedID!, $grievanceID: UnifiedID!) {
    singleGrievance(unionID: $unionID, grievanceID: $grievanceID) {
      id
      documents {
        name
        url
        docType
        createdAt
        createdBy
        deleted
        deletedBy
        status
        updatedOn
      }
      unit
      steward {
        id
        memberID
        firstName
        lastName
        unit
      }
      subSteward {
        id
        memberID
        firstName
        lastName
        unit
      }
      members {
        lastName
        firstName
        status
        unionPosition
        membershipType
        profile {
            address
            city
            province
            postalCode
            phone
            mobile       
        }
        jobTitle
        classification
        jobLocation {
            title
            address1
            address2
            city
            province
            postalCode
            country
          }
      }
      title
      details
      createdAt
      lastUpdatedAt
      caseNumber
      employer
      supervisor
      dateFiled
      status
      claim
      request
      grievor {
        userID
        sign
        date
      }
      unionOfficer {
        userID
        sign
        date
      }
      updates {
        content
        updatedAt
        updatedBy {
          firstName
          lastName
        }
        documents {
          name
          url        
        }
      }
      dateOfSettlement
      favourOfEmployee
      particulars
      assignedTo {
        firstName
        lastName
      }
      employerRep {
        sign
        date
      }
      unionRep {
        sign
        date
      }
    }
  }
`;
