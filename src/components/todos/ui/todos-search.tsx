import { TextField } from '@mui/material';
import useTodosSearch from '../hooks/use-todos-search';

const TodosSearch = () => {
  const { inputValue, setInputValue } = useTodosSearch();

  return (
    <TextField
      id="outlined-basic"
      label="Search Query"
      variant="outlined"
      type="text"
      name="search"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default TodosSearch;

