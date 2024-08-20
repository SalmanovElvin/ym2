import { gql } from '@apollo/client';

export const LIKE_MEMORIUM = gql`
  mutation likeMemoriumItem(
    $unionID: UnifiedID!
    $memoriumID: UnifiedID!
    $userID: UnifiedID!
  ) {
    likeMemoriumItem(
      unionID: $unionID
      memoriumID: $memoriumID
      userID: $userID
    )
  }
`;

export const NEW_COMMENT_MEMORIUM = gql`
  mutation newCommentMemorium(
    $unionID: UnifiedID!
    $memoriumID: UnifiedID!
    $comment: CommentInput!
  ) {
    newCommentMemorium(
      unionID: $unionID
      memoriumID: $memoriumID
      comment: $comment
    )
  }
`;


export const PIN_MEMORIUM = gql`
  mutation pinMemoriumPost($unionID: UnifiedID!, $memoriumID: UnifiedID!) {
    pinMemoriumPost(unionID: $unionID, memoriumID: $memoriumID)
  }
`;

export const SHOW_PIN_MEMORIUM = gql`
  mutation showPinMemorium(
    $unionID: UnifiedID!
    $memoriumID: UnifiedID!
    $show: Boolean!
  ) {
    showPinMemorium(unionID: $unionID, memoriumID: $memoriumID, show: $show)
  }
`;

export const PRIVATE_MEMORIUM = gql`
  mutation makePrivateMemorium(
    $unionID: UnifiedID!
    $memoriumID: UnifiedID!
    $private: Boolean!
  ) {
    makePrivateMemorium(
      unionID: $unionID
      memoriumID: $memoriumID
      private: $private
    )
  }
`;

export const LIKE_DISPLAY_MEMORIUM = gql`
  mutation updateLikeDisplayMemorium(
    $unionID: UnifiedID!
    $memoriumID: UnifiedID!
    $likeDisplay: Boolean!
  ) {
    updateLikeDisplayMemorium(
      unionID: $unionID
      memoriumID: $memoriumID
      likeDisplay: $likeDisplay
    )
  }
`;




