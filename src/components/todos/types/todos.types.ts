export type TodosFilterValue = 'id' | 'todo' | 'completed' | 'userId';

export type TodosContextType = {
  searchValue: string;
  filterValue: TodosFilterValue;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setFilterValue: React.Dispatch<React.SetStateAction<TodosFilterValue>>;
};

export interface TodosProps {
  page: number;
  pageSize: number;
  filterKey: TodosFilterValue;
  filterValue: string;
}

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

