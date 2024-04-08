import { gql } from '@apollo/client';

export const NEW_GRIEVANCE = gql`
  mutation newGrievance($unionID: UnifiedID!, $grievance: GrievanceInput!) {
    newGrievance(unionID: $unionID, grievance: $grievance)
  }
`;

export const ADD_GRIEVANCE_UPDATE = gql`
  mutation addGrievanceUpdateInfo(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $update: GrievanceUpdateInput!
  ) {
    addGrievanceUpdateInfo(unionID: $unionID, grievanceID: $grievanceID, update: $update)
  }
`;

export const MODIFY_GRIEVANCE = gql`
  mutation modifyGrievance(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $grievance: GrievanceInput!
  ) {
    modifyGrievance(
      unionID: $unionID
      grievanceID: $grievanceID
      grievance: $grievance
    )
  }
`;

export const SEND_GRIEVANCE = gql`
  mutation SendGrievance($unionID: UnifiedID!, $grievance: GrievanceInput!) {
    newGrievance(unionID: $unionID, grievance: $grievance)
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $update: GrievanceUpdateInput!
  ) {
    addGrievanceUpdateInfo(unionID: $unionID, grievanceID: $grievanceID, update: $update)
  }
`;

export const UPDATE_GRIEVANCE = gql`
  mutation UpdateGrievance(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $grievance: GrievanceInput!
  ) {
    modifyGrievance(
      unionID: $unionID
      grievanceID: $grievanceID
      grievance: $grievance
    )
  }
`;

export const ADD_GRIEVANCE_FILE = gql`
  mutation addGrievanceFile(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $updateID: UnifiedID
    $documentName: String
    $file: Upload!
  ) {
    addGrievanceFile(
      unionID: $unionID
      grievanceID: $grievanceID
      updateID: $updateID
      documentName: $documentName
      file: $file
    )
  }
`;

export const ADD_GRIEVANCE_FILES = gql`
  mutation addGrievanceFiles(
    $unionID: UnifiedID!
    $grievanceID: UnifiedID!
    $updateID: UnifiedID
    $files: [Upload!]!
  ) {
    addGrievanceFiles(
      unionID: $unionID
      grievanceID: $grievanceID
      updateID: $updateID
      files: $files
    )
  }
`;


export const ADD_UPDATE_INFO=gql`
mutation addGrievanceUpdateInfo(
  $unionID:UnifiedID!
  $grievanceID:UnifiedID!
  $update:GrievanceUpdateInput!
){
  addGrievanceUpdateInfo(
    unionID:$unionID
    grievanceID:$grievanceID
    update:$update
  )
}
`