// MyContext.tsx (or .js)
import React, { useState } from 'react';
import TodosContext from './todos-context';
import type { TodosFilterValue } from '../types/todos.types';

export const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<TodosFilterValue>('id');

  return (
    <TodosContext.Provider
      value={{ searchValue, filterValue, setSearchValue, setFilterValue }}>
      {children}
    </TodosContext.Provider>
  );
};

