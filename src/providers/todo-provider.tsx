import { useState } from 'react';
import type { TodosFilterValue } from '../types/todos.types';
import { TodosContext } from '../contexts/todos-context';

const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState<boolean | number | string>('');
  const [filterValue, setFilterValue] = useState<TodosFilterValue>('todo');

  return (
    <TodosContext.Provider
      value={{ searchValue, filterValue, setSearchValue, setFilterValue }}>
      {children}
    </TodosContext.Provider>
  );
};

export default TodosProvider;

