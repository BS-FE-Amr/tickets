import type { SelectChangeEvent } from '@mui/material';
import { useTodosContext } from './use-todos-context';
import type { TodosFilterValue } from '../types/todos.types';

const useFilterDropDown = () => {
  const { filterValue, setFilterValue } = useTodosContext();

  const handleChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value as TodosFilterValue);
  };

  return { filterValue, handleChange };
};

export default useFilterDropDown;
