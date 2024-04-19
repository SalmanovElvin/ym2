import { gql } from '@apollo/client';

export const CREATE_NEWS = gql`
  mutation createNews(
    $unionID: UnifiedID!
    $input: NewsInput!
    $images: [Upload]
  ) {
    createNews(unionID: $unionID, input: $input, images: $images)
  }
`;

export const LIKE_NEWS_ITEM = gql`
  mutation likeNewsItem(
    $unionID: UnifiedID!
    $newsID: UnifiedID!
    $userID: UnifiedID!
  ) {
    likeNewsItem(unionID: $unionID, newsID: $newsID, userID: $userID)
  }
`;

export const ADD_COMMENT = gql`
  mutation newComment(
    $unionID: UnifiedID!
    $newsID: UnifiedID!
    $comment: CommentInput!
  ) {
    newComment(unionID: $unionID, newsID: $newsID, comment: $comment)
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment(
    $unionID: UnifiedID!
    $newsID: UnifiedID!
    $commentID: UnifiedID!
  ) {
    deleteComment(unionID: $unionID, newsID: $newsID, commentID: $commentID)
  }
`;

export const PIN_NEWS = gql`
  mutation pinNewsPost($unionID: UnifiedID!, $newsID: UnifiedID!) {
    pinNewsPost(unionID: $unionID, newsID: $newsID)
  }
`;