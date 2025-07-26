import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useFilterDropDown from '../hooks/use-filter-dropdown';

export default function UsersFilterDropdown() {
  const { filterValue, handleChange } = useFilterDropDown();
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Filter</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={filterValue}
        label="Filter"
        onChange={handleChange}>
        <MenuItem value={'id'}>Id</MenuItem>
        <MenuItem value={'todo'}>Todo</MenuItem>
        <MenuItem value={'completed'}>Completed</MenuItem>
        <MenuItem value={'userId'}>userId</MenuItem>
      </Select>
    </FormControl>
  );
}

