export interface TodosData {
  id: string;
  todo: string;
  completed: string;
  userId: string;
}

export interface TodosResponse {
  todos: TodosData[];
  total: number;
  skip: number;
  limit: number;
}

export interface TodosNewData {
  todo: string;
  completed: string;
  userId: string;
}
