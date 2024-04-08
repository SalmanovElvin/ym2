import { gql } from '@apollo/client';

export const GET_FILTERS = gql`
  query GetFilters($unionID: UnifiedID!) {
    filters(unionID: $unionID) {
      name
      params
    }
  }
`;

export const GET_SAVED_FILTERS = gql`
  query GetSavedFilters($unionID: UnifiedID!) {
    savedFilters(unionID: $unionID) {
      ID
      filterName
      filters {
        name
        params
      }
    }
  }
`;

export const FILTERS = gql`
  query filters($unionID: UnifiedID!) {
    filters(unionID: $unionID) {
      name
      params
    }
  }
`;
