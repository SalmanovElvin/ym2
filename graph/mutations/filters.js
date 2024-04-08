import { gql } from '@apollo/client';

export const SAVE_FILTER = gql`
  mutation SaveFilter(
    $unionID: UnifiedID!
    $filterName: String!
    $filters: [FilterInput]
  ) {
    saveFilter(unionID: $unionID, filterName: $filterName, filters: $filters)
  }
`;
