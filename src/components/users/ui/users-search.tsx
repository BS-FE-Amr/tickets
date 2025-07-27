import { TextField } from '@mui/material';
import useUsersSearch from '../hooks/use-users-search';

const UsersSearch = () => {
  const { inputValue, setInputValue } = useUsersSearch();

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

export default UsersSearch;

