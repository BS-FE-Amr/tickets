export type TodosFilterValue = 'completed' | 'todo' | 'userId';

export interface TodosData {
  todo: string;
  completed: boolean;
  userId: number | null;
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

