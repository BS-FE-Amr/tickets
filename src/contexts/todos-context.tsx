import { createContext, useContext } from 'react';
import type { TodosFilterValue } from '../types/todos.types';

export type TodosContextType = {
  searchValue: string;
  filterValue: TodosFilterValue;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
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

