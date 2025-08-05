import { createContext, useContext } from 'react';
import type { UsersFilterValue } from '../types/users.types';

export type UsersContextType = {
  searchValue: string | number;
  filterValue: UsersFilterValue;
  setSearchValue: React.Dispatch<React.SetStateAction<string | number>>;
  setFilterValue: React.Dispatch<React.SetStateAction<UsersFilterValue>>;
};

export const UsersContext = createContext<UsersContextType | undefined>(
  undefined,
);

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

