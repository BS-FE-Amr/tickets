import { useState } from 'react';
import type { UsersFilterValue } from '../types/users.types';
import { UsersContext } from '../contexts/users-context';

const UsersProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<UsersFilterValue>('id');

  return (
    <UsersContext.Provider
      value={{ searchValue, filterValue, setSearchValue, setFilterValue }}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersProvider;

