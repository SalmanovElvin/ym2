import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query users($unionID: UnifiedID!) {
    users(unionID: $unionID) {
      id
      memberID
      username
      firstName
      lastName
      profile {
        imageURL
        email
      }
      unionPosition
    }
  }
`;

//get user graphql query
export const GET_MEMBERS = gql`
  query GetMembers($unionID: UnifiedID!, $filter: [FilterInput]) {
    members(unionID: $unionID, filter: $filter) {
      data {
        firstName
        lastName
        id
        status
        unionID
        memberID
        startDate
        unionPosition
        isAdmin
        jobTitle
        unit
        employmentType
        employmentStatus
        profile {
          email
          imageURL
          address
          city
          province
          postalCode
          phone
          description
        }
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($unionID: UnifiedID, $id: UnifiedID) {
    singleUser(unionID: $unionID, id: $id) {
      firstName
      lastName
      id
      status
      unionID
      memberID
      unionPosition
      startDate
      jobTitle
      unit
      employmentType
      employmentStatus
      profile {
        email
        imageURL
        address
        city
        province
        postalCode
        phone
        description
      }
    }
  }
`;

export const SINGLE_USER = gql`
  query singleUser($unionID: UnifiedID, $userID: UnifiedID) {
    singleUser(unionID: $unionID, userID: $userID) {
      id
      unionID
      memberID
      status
      username
      firstName
      lastName
      middleName
      maidenName
      commonName
      gender
      profile {
        email
        unionMail
        imageURL
        address
        city
        province
        postalCode
        phone
        mobile
      }
      dateOfBirth
      unit
      jobTitle
      commitee
      membershipType
      employmentType
      employmentStatus
      unionPosition
      device
      location
      seniorityNumber
      startDate
      department
      badgeNumber
      classification
      apprenticeLevel
      memberCraft
      memberClass
      zone
      apprenticeLevel
      memberCraft
      memberClass
      shift
      driversLicense {
        number
        type
        expiryDate
      }
      jobLocation {
        id
        title
        address1
        address2
        city
        province
        postalCode
        country
      }
      emailOpOut
      callOpOut
      textOpOut
      pushOpOut
      unionStatus
      familyMembersData {
        id
        firstName
        lastName
        dateOfBirth
        relationship
        gender
      }
      courses {
        id
        certificate
        courseName
        startDate
        endDate
        validUntil
      }
      notes
    }
  }
`;

export const EXECUTIVES = gql`
  query executives($unionID: UnifiedID!) {
    executives(unionID: $unionID) {
      id
      executiveID
      position
      extension
      orderNumber
      memberData {
        id
        firstName
        lastName
        memberID
        unionID
        status
        unit
        preferredLanguage
        profile {
          unionMail
          imageURL
          phone
          mobile
        }
      }
    }
  }
`;

/* export const GET_USERS = gql`
  query GetUsers($unionID: UnifiedID!) {
    users(unionID: $unionID) {
      id
      memberID
      unionID
      status
      firstName
      lastName
      unionPosition
      startDate
      jobTitle
      unit
      employmentType
      employmentStatus
      profile {
        email
        imageURL
        address
        city
        province
        postalCode
        phone
        description
      }
    }
  }
`; */
