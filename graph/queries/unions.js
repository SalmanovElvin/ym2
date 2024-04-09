import { gql } from '@apollo/client';

//get union graphql query
export const GET_UNIONS = gql`
  {
    unions {
      id
      name
    }
  }
`;

//get single union
export const GET_UNION = gql`
  query singleUnion($unionID: UnifiedID) {
    singleUnion(unionID: $unionID) {
      id
      name
      bannedDomains
      information {
        email
        address
        city
        province
        postalCode
        phone
        description
        imageURL
      }
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
      modules
      bargainingUnits
      bannerURL
    }
  }
`;


//get union by name
export const GET_UNION_BY_NAME = gql`
	query unionByName($name: String!) {
		unionByName(name: $name) {
			id
			name
			status
			hostEmail
			defaultEmailPassword
			information {
				email
				unionMail
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
			bargainingUnits
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
			bannerURL
			bannedDomains
			domain
			theme
			themeImage
			twitter
			facebook
			instagram
		}
	}
`;