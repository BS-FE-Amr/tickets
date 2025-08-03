import { useState } from 'react';
import type { TodosFilterValue } from '../types/todos.types';
import { TodosContext } from '../contexts/todos-context';

const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<TodosFilterValue>('id');

  return (
    <TodosContext.Provider
      value={{ searchValue, filterValue, setSearchValue, setFilterValue }}>
      {children}
    </TodosContext.Provider>
  );
};

export default TodosProvider;

