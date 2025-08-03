export type TodosFilterValue = 'completed' | 'todo' | 'userId' | 'id';

export interface TodosData {
  id: string;
  todo: string;
  completed: string;
  userId: string;
  documentId: string;
}

export interface TodoItemResponse {
  data: TodosData;
}

export interface TodosResponse {
  data: TodosData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface TodosNewData {
  todo: string;
  completed: string;
  userId: string;
}

