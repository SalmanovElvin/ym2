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
