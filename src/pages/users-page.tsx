import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
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
  Tooltip,
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

import { useUsersContext } from '../contexts/users-context';
import DataDisplay from '../components/data-display';
import useDebounce from '../hooks/use-debounce';
import type {
  UsersData,
  UsersFilterValue,
  UsersNewData,
  UsersResponse,
} from '../types/users-gql.types';
import type { FetchPaginatedFilteredSearch } from '../types/general.types';
import {
  CREATE_USER,
  DELETE_USER,
  FETCH_USER,
  FETCH_USERS,
  UPDATE_USER,
} from '../services/users-service-gql';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import UserDetails from './users/user-details';

interface Column {
  id: 'firstName' | 'lastName' | 'age';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const UsersPage = () => {
  const { filterValue, setFilterValue, searchValue, setSearchValue } =
    useUsersContext();

  const { inputValue, setInputValue } = useDebounce<string | number>(
    setSearchValue,
    '',
  );

  const handleChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value as UsersFilterValue);
    setInputValue('');
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const { data, error, isLoading } = useQuery<UsersResponse>({
  //   queryKey: ['users', page, rowsPerPage, searchValue, filterValue],
  //   queryFn: () => fetchUsers(searchValue, filterValue, rowsPerPage, page),
  // });

  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (filterValue === 'age') {
      if (!searchValue) {
        setFilters({});
      } else {
        setFilters({
          [filterValue]: { contains: Number(searchValue) },
        });
      }
    } else {
      setFilters({ [filterValue]: { contains: searchValue } });
    }
  }, [searchValue]);

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<UsersResponse, FetchPaginatedFilteredSearch>(FETCH_USERS, {
    variables: {
      page: page,
      pageSize: rowsPerPage,
      filters: filters,
    },
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
    firstName: string,
    lastName: string,
    age: number,
    documentId: string,
  ): UsersData {
    return { firstName, lastName, age, documentId };
  }

  const rows = useMemo(() => {
    return (
      data?.employees_connection?.nodes.map((user: UsersData) => {
        return createData(
          user?.firstName,
          user?.lastName,
          user?.age,
          user?.documentId,
        );
      }) || []
    );
  }, [data]);

  const columns: readonly Column[] = [
    // { id: 'id', label: 'Id', minWidth: 170 },
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

  const handleOpenModal = (row: UsersData, type: 'view' | 'delete') => {
    setSelectedRow(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  const [
    deleteUserMutation,
    { loading: isDeleting, error: errorDeletingUser },
  ] = useMutation(DELETE_USER, {
    refetchQueries: ['GetUsers'],
    onCompleted: () => {
      handleCloseModal();
      toast.success(`User Deleted Successfully!`);
    },
    onError: () => {
      toast.error(
        errorDeletingUser?.message || 'Error while deleting the user',
      );
    },
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [newUser, setNewUser] = useState<null | UsersNewData>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<UsersData>>({});
  const [modalType, setModalType] = useState<null | 'view' | 'delete'>(null);
  const [selectedRow, setSelectedRow] = useState<UsersData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    createUserMutation,
    { loading: isCreating, error: errorCreatingUser },
  ] = useMutation(CREATE_USER, {
    refetchQueries: ['GetUsers'],
    onCompleted: () => {
      setNewUser(null);
      toast.success(`New User Added Successfully!`);
    },
    onError: () => {
      toast.error(
        errorCreatingUser?.message || 'Error while creating the user',
      );
    },
  });

  const [updateUserMutation, { loading: isUpdating, error: errorUpdating }] =
    useMutation(UPDATE_USER, {
      refetchQueries: [
        'GetUsers',
        {
          query: FETCH_USER,
          variables: { documentId: editRowId },
        },
      ],
      onCompleted: (data) => {
        console.log(data);
        toast.success(`User Updated Successfully!`);
      },
      onError: () => {
        toast.error(
          errorUpdating?.message ||
            'Something went wrong while updating the user.',
        );
      },
    });

  const handleModalClose = () => {
    if (selectedRow) {
      setSelectedRow(null);
    }
    setModalType(null);
    setIsModalOpen(false);
  };

  const isNumber = filterValue === 'age';

  return (
    <div className="container mt-[24px]">
      {/* Head */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
        <Typography variant="h4">Users List</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={!!newUser}
          onClick={() => {
            setNewUser({
              firstName: '',
              lastName: '',
              age: null,
            });
          }}>
          Add New User
        </Button>
      </Box>
      <div className="mt-[24px] ">
        <div className="flex gap-[24px] mb-[24px]">
          {/* Users Search */}
          <TextField
            id="outlined-basic"
            label="Search Query"
            variant="outlined"
            type={isNumber ? 'number' : 'text'}
            name="search"
            value={inputValue}
            onChange={(e) =>
              setInputValue(
                e.target.value === '0' || Number(e.target.value) === 0
                  ? ''
                  : isNumber
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
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
              {/* <MenuItem value={'id'}>Id</MenuItem> */}
              <MenuItem value={'firstName'}>First Name</MenuItem>
              <MenuItem value={'lastName'}>Last Name</MenuItem>
              <MenuItem value={'age'}>Age</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Users Table */}
        <DataDisplay<UsersResponse | undefined>
          data={data}
          error={error?.message}
          isLoading={isLoading}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={'left'}
                        style={{
                          minWidth: column.minWidth,
                          fontWeight: 'bold',
                        }}>
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell
                      align={'left'}
                      style={{
                        fontWeight: 'bold',
                      }}>
                      {'Actions'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: UsersData) => {
                    const isEditing = editRowId === row.documentId;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.documentId}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          const editedValue = editedRow[column.id];

                          return (
                            <TableCell key={column.id} align={'left'}>
                              {isEditing ? (
                                <TextField
                                  value={editedValue ?? value}
                                  onChange={(e) =>
                                    setEditedRow((prev) => ({
                                      ...prev,
                                      [column.id]:
                                        typeof value === 'number'
                                          ? Number(e.target.value)
                                          : e.target.value,
                                    }))
                                  }
                                  variant="standard"
                                  type={
                                    typeof value === 'number'
                                      ? 'number'
                                      : 'text'
                                  }
                                  fullWidth
                                />
                              ) : column.format && typeof value === 'number' ? (
                                column.format(value)
                              ) : (
                                String(value)
                              )}
                            </TableCell>
                          );
                        })}

                        <TableCell align="center">
                          <Box display="flex" gap={1}>
                            {isEditing ? (
                              <>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  disabled={isUpdating}
                                  onClick={async () => {
                                    await updateUserMutation({
                                      variables: {
                                        documentId: editRowId,
                                        data: editedRow,
                                      },
                                    });
                                    setEditRowId(null);
                                    setEditedRow({});
                                  }}>
                                  Update
                                </Button>
                                <Button
                                  color="primary"
                                  disabled={isUpdating}
                                  onClick={() => {
                                    setEditRowId(null);
                                    setEditedRow({});
                                  }}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => {
                                    setEditRowId(row.documentId);
                                    setEditedRow({
                                      firstName: row.firstName,
                                      lastName: row.lastName,
                                      age: row.age,
                                    });
                                  }}>
                                  Edit
                                </Button>
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleOpenModal(row, 'view')}>
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <Tooltip title="Delete User">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleOpenModal(row, 'delete')
                                    }>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {newUser && (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = newUser[column.id];

                        return (
                          <TableCell key={column.id} align="left">
                            <TextField
                              variant="standard"
                              fullWidth
                              type={
                                typeof value === 'number' ? 'number' : 'text'
                              }
                              value={value}
                              onChange={(e) =>
                                setNewUser((prev) =>
                                  !prev
                                    ? prev
                                    : {
                                        ...prev,
                                        [column.id]:
                                          typeof value === 'number'
                                            ? Number(e.target.value)
                                            : e.target.value,
                                      },
                                )
                              }
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell align={'center'}>
                        <Box display="flex" gap={1}>
                          <Button
                            color="primary"
                            variant="outlined"
                            disabled={isCreating}
                            onClick={async () =>
                              await createUserMutation({
                                variables: {
                                  data: newUser,
                                },
                              })
                            }>
                            Create
                          </Button>
                          <Button
                            color="primary"
                            disabled={isCreating}
                            onClick={() => setNewUser(null)}>
                            Cancel
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data?.employees_connection.pageInfo.total as number}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </DataDisplay>

        <Modal
          open={isModalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description">
          {modalType === 'view' ? (
            <UserDetails userId={selectedRow?.documentId} />
          ) : (
            <Box sx={style}>
              <Typography variant="h5" fontWeight="bold">
                Are you sure you want to delete user #{selectedRow?.firstName}
              </Typography>

              <div className="flex justify-between">
                <Button onClick={handleCloseModal} disabled={isDeleting}>
                  Close
                </Button>
                <Button
                  onClick={async () => {
                    await deleteUserMutation({
                      variables: {
                        documentId: selectedRow?.documentId,
                      },
                    });
                  }}
                  disabled={isDeleting}>
                  Delete
                </Button>
              </div>
            </Box>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;

