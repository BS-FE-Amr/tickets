import { gql } from '@apollo/client';

export const FETCH_TODOS = gql`
  query GetTodos($page: Int, $pageSize: Int, $filters: TodoFiltersInput) {
    todos_connection(
      pagination: { page: $page, pageSize: $pageSize }
      filters: $filters
      sort: "employee.documentId"
    ) {
      nodes {
        documentId
        todo
        userId
        completed
        employee {
          documentId
          firstName
          lastName
          age
        }
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

export const FETCH_TODO = gql`
  query GetTodo($documentId: ID!) {
    todo(documentId: $documentId) {
      documentId
      todo
      completed
      employee {
        firstName
        lastName
      }
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($data: TodoInput!) {
    createTodo(data: $data) {
      todo
      documentId
      userId
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($documentId: ID!) {
    deleteTodo(documentId: $documentId) {
      documentId
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($documentId: ID!, $data: TodoInput!) {
    updateTodo(documentId: $documentId, data: $data) {
      documentId
      todo
      userId
      completed
    }
  }
`;

export const GET_TODO_STATS = gql`
  query GetStatus {
    todoStats {
      completed
      notCompleted
    }
  }
`;

export const GET_TODO_ASSIGNED_STATS = gql`
  query GetAssignedStatus {
    employeeAssignmentStats {
      assignedEmployees
      unassignedEmployees
      totalEmployees
    }
  }
`;

