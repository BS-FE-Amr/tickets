import { gql } from '@apollo/client';

export const FETCH_USERS = gql`
  query GetEmployees(
    $page: Int
    $pageSize: Int
    $filters: EmployeeFiltersInput
  ) {
    employees_connection(
      pagination: { page: $page, pageSize: $pageSize }
      filters: $filters
    ) {
      nodes {
        documentId
        firstName
        lastName
        age
      }
      pageInfo {
        pageSize
        page
        pageCount
        total
      }
    }
  }
`;

export const FETCH_USER = gql`
  query GetUser($documentId: ID!) {
    employee(documentId: $documentId) {
      documentId
      firstName
      lastName
      age
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateEmployee($data: EmployeeInput!) {
    createEmployee(data: $data) {
      firstName
      lastName
      documentId
      age
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($documentId: ID!) {
    deleteEmployee(documentId: $documentId) {
      documentId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($documentId: ID!, $data: EmployeeInput!) {
    updateEmployee(documentId: $documentId, data: $data) {
      documentId
      firstName
      lastName
      age
    }
  }
`;

export const FETCH_MY_DATA = gql`
  query GetMe {
    user {
      documentId
      firstName
      lastName
    }
  }
`;

