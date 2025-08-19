import { createContext, useContext } from 'react';
import type { TodosFilterValue } from '../types/todos-gql.types';

export type TodosContextType = {
  searchValue: string | boolean | number;
  filterValue: TodosFilterValue;
  setSearchValue: React.Dispatch<
    React.SetStateAction<string | boolean | number>
  >;
  setFilterValue: React.Dispatch<React.SetStateAction<TodosFilterValue>>;
};

export const TodosContext = createContext<TodosContextType | undefined>(
  undefined,
);

export const useTodosContext = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
};

