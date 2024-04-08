import { gql } from "@apollo/client";

export const GET_CLICK_TO_CALLS = gql`
  query getClickToCalls($unionID: UnifiedID!, $page: Int, $perPage: Int) {
    getClickToCalls(unionID: $unionID, page: $page, perPage: $perPage) {
      data {
        id
        creatorID
        title
        phone
        startDate
        endDate
        script
      }
      total
    }
  }
`;
