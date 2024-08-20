import { gql } from '@apollo/client';

export const GET_MEMORIUM = gql`
  query memoriumFeed(
    $unionID: UnifiedID!
    $unit: String
    $page: Int
    $perpage: Int
    $category: String!
  ) {
    memoriumFeed(
      unionID: $unionID
      unit: $unit
      page: $page
      perpage: $perpage
      category: $category
    ) {
      total
      data {
        id
        content
        createdOn
        unit
        creator {
          id
          firstName
          lastName
          profile {
            imageURL
          }
        }
        userID
        likes
        dislikes
        comments {
          id
          content
          createdOn
          likes
          dislikes
        }
        documents {
          url
          name
        }
        images
        pinned
        private
        asUnion
        showLikes
        showComments
        commentCount
      }
      pinned {
        id
        content
        createdOn
        unit
        creator {
          id
          firstName
          lastName
          profile {
            imageURL
          }
        }
        userID
        likes
        dislikes
        comments {
          id
          content
          createdOn
          likes
          dislikes
        }
        documents {
          url
          name
        }
        images
        pinned
        show
        private
        asUnion
        showLikes
        showComments
        commentCount
      }
    }
  }
`;

export const SINGLE_MEMORIUM = gql`
  query singleMemorium($unionID: UnifiedID!, $memoriumID: UnifiedID!) {
    singleMemorium(unionID: $unionID, memoriumID: $memoriumID) {
      comments {
        id
        content
        createdOn
        likes
        dislikes
        creator {
          id
          firstName
          lastName
          profile {
            imageURL
          }
        }
      }
    }
  }
`;

export const SINGLE_MEMORIUM_POST = gql`
  query singleMemorium($unionID: UnifiedID!, $memoriumID: UnifiedID!) {
    singleMemorium(unionID: $unionID, memoriumID: $memoriumID) {
      id
      content
      createdOn
      unit
      creator {
        id
        firstName
        lastName
        profile {
          imageURL
        }
      }
      userID
      likes
      dislikes
      comments {
        id
        content
        createdOn
        likes
        dislikes
        creator {
          id
          firstName
          lastName
          profile {
            imageURL
          }
        }
      }
      images
      documents {
        url
        name
      }
      pinned
      showLikes
      showComments
      show
      private
      asUnion
      commentCount
    }
  }
`;
