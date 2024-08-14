import { gql } from '@apollo/client';

//Login graphql mutation
export const LOGIN_USER = gql`
  mutation login($input: Credential, $device: String) {
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
				unionID
				firstName
				lastName
				status
				profile {
					imageURL
					email
					phone
					unionMail
					mobile
				}
				unionPosition
				token
				barcode
				permission
				unit
				isAdmin
				emailPassword
			}
			union {
				id
				name
				hostEmail
				defaultEmailPassword
				infoTabs {
					title
					key
					display
					position
					category
					kind
					public
				}
				information {
					email
					imageURL
					address
					city
					province
					postalCode
					phone
					fax
					description
					bannerURL
					presidentMessage
					importantLinks {
						url
						name
					}
					websiteLinks {
						url
						name
					}
				}
				grievance {
					title
					type
					key
					errorMsg
					required
					display
					modify
					position
				}
				modules
				registration {
					title
					type
					key
					errorMsg
					required
					display
					modify
					position
				}
				bannedDomains
				bargainingUnits
				domain
				bannerURL
				theme
				themeImage
				twitter
				twitterLinks
				facebook
				facebookLinks
				instagram
				instagramLinks
				accountManager {
					firstName
					lastName
					email
					phone
					imageURL
				}
				communicationRep {
					firstName
					lastName
					email
					phone
					imageURL
				}
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

export const REGISTER_MEMBER = gql`
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

export const DELETE_USER = gql`
	mutation deleteUser($unionID: UnifiedID!, $userID: UnifiedID!) {
		deleteUser(unionID: $unionID, userID: $userID)
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
