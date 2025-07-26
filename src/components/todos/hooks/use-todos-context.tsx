// useTodos.ts
import { useContext } from 'react';
import TodosContext from '../contexts/todos-context';

export const useTodosContext = () => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodosProvider');
  }
  return context;
};

