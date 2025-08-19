import type { UsersData } from './users-gql.types';

export type TodosFilterValue = 'completed' | 'todo' | 'employee';

export interface TodosData {
  todo: string;
  completed: boolean;
  employee: UsersData;
  documentId: string;
}

export interface TodosTableData {
  todo: string;
  completed: boolean;
  employee: string;
  documentId: string;
}

export interface TodoItemResponse {
  todo: TodosData;
}

export interface TodosResponse {
  todos_connection: {
    nodes: TodosData[];
    pageInfo: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TodosNewData {
  todo: string;
  completed: boolean;
  userId: number | null;
}

export interface TodosStatusResponse {
  todoStats: {
    total: number;
    completed: number;
    notCompleted: number;
  };
}

export interface TodosStatusAssignedResponse {
  employeeAssignmentStats: {
    assignedEmployees: number;
    unassignedEmployees: number;
    totalEmployees: number;
  };
}

