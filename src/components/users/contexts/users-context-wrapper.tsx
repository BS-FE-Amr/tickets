// MyContext.tsx (or .js)
import React, { useState } from 'react';
import UsersContext from './users-context';
import type { UsersFilterValue } from '../types/users.types';

export const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<UsersFilterValue>('id');

  return (
    <UsersContext.Provider
      value={{ searchValue, filterValue, setSearchValue, setFilterValue }}>
      {children}
    </UsersContext.Provider>
  );
};

