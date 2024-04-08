import { gql } from '@apollo/client';

//get news using graphql query

export const GET_NEWS = gql`
  query newsFeed(
    $unionID: UnifiedID!
    $unit: String
    $page: Int
    $perpage: Int
    $category: String!
  ) {
    newsFeed(
      unionID: $unionID
      unit: $unit
      page: $page
      perpage: $perpage
      category: $category
    ) {
      data {
        id
        content
        createdOn
        unit
        creator {
          firstName
          lastName
          profile {
            imageURL
          }
        }
        unit
        userID
        likes
        dislikes
        comments {
          likes
          content
        }
        images
        show
        pinned
        asUnion
        showLikes
        showComments
      }
      total
      pinned {
        id
        content
        createdOn
        unit
        creator {
          firstName
          lastName
          profile {
            imageURL
          }
        }
        unit
        userID
        likes
        dislikes
        comments {
          likes
          content
        }
        images
        show
        pinned
        asUnion
        showLikes
        showComments
      }
    }
  }
`;

export const SINGLE_NEWS_POST = gql`
  query singleNews($unionID: UnifiedID!, $newsID: UnifiedID!) {
    singleNews(unionID: $unionID, newsID: $newsID) {
      id
      content
      createdOn
      unit
      asUnion
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
      show
      private
      commentCount
    }
  }
`;

export const GET_NEWS_COMMENT = gql`
  query newsComments($unionID: UnifiedID!, $newsID: UnifiedID!) {
    newsComments(unionID: $unionID, newsID: $newsID) {
      id
      content
      createdOn
      userID
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
`;

export const GET_COMMENT_CONTENT = gql`
  query commentsData($unionID: UnifiedID!, $newsID: UnifiedID!) {
    commentsData(unionID: $unionID, newsID: $newsID) {
      id
      content
    }
  }
`;
