import React, { useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import { useUsersContext } from '../contexts/users-context';
import type {
  UsersData,
  UsersFilterValue,
  UsersResponse,
} from '../types/users.types';
import DataDisplay from '../components/data-display';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

interface Column {
  id: 'id' | 'firstName' | 'lastName' | 'age';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const UsersPage = () => {
  const [inputValue, setInputValue] = useState('');

  const { filterValue, setFilterValue, searchValue, setSearchValue } =
    useUsersContext();

  const handleChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value as UsersFilterValue);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [inputValue, setSearchValue]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, error, isLoading } = useQuery({
    queryKey: ['users', page, rowsPerPage, searchValue, filterValue],
    queryFn: () =>
      api
        .get(
          filterValue && searchValue
            ? `/auth/users/filter?limit=${rowsPerPage}&skip=${
                rowsPerPage * page
              }&key=${filterValue}&value=${searchValue}`
            : `/auth/users?limit=${rowsPerPage}&skip=${rowsPerPage * page}`,
        )
        .then((res) => res.data),
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(
    id: number,
    firstName: string,
    lastName: string,
    age: number,
  ): UsersData {
    return { id, firstName, lastName, age };
  }

  const rows = useMemo(() => {
    return (
      data?.users?.map((user: UsersData) => {
        return createData(user?.id, user?.firstName, user?.lastName, user?.age);
      }) || []
    );
  }, [data]);

  const columns: readonly Column[] = [
    { id: 'id', label: 'Id', minWidth: 170 },
    { id: 'firstName', label: 'First Name', minWidth: 100 },
    {
      id: 'lastName',
      label: 'LastName',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'age',
      label: 'Age',
      minWidth: 170,
      align: 'right',
    },
  ];

  return (
    <div className="container mt-[24px]">
      {/* Head */}
      <Typography variant="h5" fontWeight="bold">
        Users
      </Typography>
      <div className="mt-[24px] ">
        <div className="flex gap-[24px] mb-[24px]">
          {/* Users Search */}
          <TextField
            id="outlined-basic"
            label="Search Query"
            variant="outlined"
            type="text"
            name="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {/* Users Filter dropdown */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterValue}
              label="Filter"
              onChange={handleChange}>
              <MenuItem value={'id'}>Id</MenuItem>
              <MenuItem value={'firstName'}>First Name</MenuItem>
              <MenuItem value={'lastName'}>Last Name</MenuItem>
              <MenuItem value={'age'}>Age</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Users Table */}
        <DataDisplay<UsersResponse | null>
          data={data}
          error={error}
          isLoading={isLoading}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: UsersData) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data?.total as number}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </DataDisplay>
      </div>
    </div>
  );
};

export default UsersPage;

