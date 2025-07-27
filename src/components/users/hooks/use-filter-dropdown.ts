import type { SelectChangeEvent } from '@mui/material';
import type { UsersFilterValue } from '../types/users.types';
import { useUsersContext } from './use-users-context';

const useFilterDropDown = () => {
  const { filterValue, setFilterValue } = useUsersContext();

  const handleChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value as UsersFilterValue);
  };

  return { filterValue, handleChange };
};

export default useFilterDropDown;

