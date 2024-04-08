import { gql } from '@apollo/client';

//Login graphql mutation
export const LOGIN_USER = gql`
  mutation Login($input: Credential, $device: String) {
    login(input: $input, device: $device) {
      user {
        id
        token
        username
        firstName
        lastName
        unionID
        status
        memberID
        unionPosition
        startDate
        jobTitle
        unit
        employmentType
        barcode
        permission
        employmentStatus
        dateOfBirth
        device
        profile {
          email
          imageURL
          address
          city
          province
          postalCode
          phone
        }
      }
      union {
        id
        name
        information {
          email
          imageURL
          address
          city
          province
          postalCode
          phone
          description
          bannerURL
        }
        modules
        bargainingUnits
      }
    }
  }
`;

export const REGISTER = gql`
  mutation register($union: UnionInput!, $user: UserInput!) {
    register(union: $union, user: $user)
  }
`;
export const LOGIN_WITH_TOKEN = gql`
  mutation loginWithToken($token: String!, $device: String) {
    loginWithToken(token: $token, device: $device) {
      user {
        id
        token
        username
        firstName
        lastName
        unionID
        status
        memberID
        unionPosition
        startDate
        jobTitle
        unit
        employmentType
        barcode
        permission
        employmentStatus
        dateOfBirth
        device
        isAdmin
        profile {
          email
          imageURL
          address
          city
          province
          postalCode
          phone
        }
      }
      union {
        id
        name
        information {
          email
          imageURL
          address
          city
          province
          postalCode
          phone
          description
          bannerURL
        }
        modules
        bargainingUnits
      }
    }
  }
`;

//gql mutation for new user creation on the registration screen
// export const REGISTER_USER = gql`
//   mutation RegisterUser($unionID: UnifiedID!, $UserInput: UserInput!) {
//     newUser(unionID: $unionID, input: $UserInput) {
//       id
//       firstName
//       lastName
//       status
//       unionID
//       memberID
//       profile {
//         imageURL
//         email
//         address
//         city
//         province
//         postalCode
//         phone
//         description
//       }
//     }
//   }
// `;

export const REGISTER_USER = gql`
  mutation memberRegistration($unionID: UnifiedID!, $input: UserInput!) {
    memberRegistration(unionID: $unionID, input: $input) {
      id
    }
  }
`;

//update graphql mutation
export const MODIFY_USER = gql`
  mutation modifyUser(
    $unionID: UnifiedID!
    $userID: UnifiedID!
    $input: UserInput
  ) {
    modifyUser(unionID: $unionID, userID: $userID, input: $input) {
      id
      firstName
      lastName
      dateOfBirth
      status
      unionID
      username
      memberID
      unionPosition
      startDate
      jobTitle
      unit
      profile {
        imageURL
        email
        address
        city
        province
        postalCode
        phone
        mobile
        description
      }
      employmentType
      employmentStatus
    }
  }
`;

export const OPT_OUT = gql`
  mutation optionOut(
    $unionID: UnifiedID!
    $userID: UnifiedID!
    $service: String!
    $opOut: Boolean!
  ) {
    optionOut(
      unionID: $unionID
      userID: $userID
      service: $service
      opOut: $opOut
    )
  }
`;
