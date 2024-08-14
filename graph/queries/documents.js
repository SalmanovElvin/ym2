import { gql } from '@apollo/client';

export const DOCUMENTS = gql`
  query documents($unionID: UnifiedID!, $category: String) {
    documents(unionID: $unionID, category: $category) {
      id
      name
      url
      unit
      docType
      orderNumber
      category
      createdAt
      createdBy
      deleted
      deletedBy
      status
      updatedOn
    }
  }
`;

export const RETIREES = gql`
  query retirees($unionID: UnifiedID!, $category: String) {
    retirees(unionID: $unionID, category: $category) {
      id
      name
      url
      unit
      docType
      orderNumber
      category
      createdAt
      createdBy
      deleted
      deletedBy
      status
      updatedOn
    }
  }
`;