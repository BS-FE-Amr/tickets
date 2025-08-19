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
import * as Yup from 'yup';

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
import { Form, Formik } from 'formik';
import { handlePaste } from '../utils/helper';
import Logger from '../components/logger';
import { GET_TODO_ASSIGNED_STATS } from '../services/todos-service-gql';

interface Column {
  id: 'firstName' | 'lastName' | 'age';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  type: 'string' | 'number';
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
    { id: 'firstName', label: 'First Name', minWidth: 100, type: 'string' },
    {
      id: 'lastName',
      label: 'LastName',
      minWidth: 170,
      align: 'right',
      type: 'string',
    },
    {
      id: 'age',
      label: 'Age',
      minWidth: 170,
      align: 'right',
      type: 'number',
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
    refetchQueries: ['GetEmployees', { query: GET_TODO_ASSIGNED_STATS }],
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

  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<UsersData>>({});
  const [modalType, setModalType] = useState<null | 'view' | 'delete'>(null);
  const [selectedRow, setSelectedRow] = useState<UsersData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    createUserMutation,
    { loading: isCreating, error: errorCreatingUser },
  ] = useMutation(CREATE_USER, {
    refetchQueries: ['GetEmployees', { query: GET_TODO_ASSIGNED_STATS }],
    onCompleted: () => {
      setIsNewUser(false);
      setEditedRow({});
      setEditRowId(null);
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
        'GetEmployees',
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

  const globalLock = !!(isNewUser || editRowId);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name required'),
    lastName: Yup.string().required('Last Name is required'),
    age: Yup.number()
      .required('Age is required')
      .min(18, 'Age must be at least 18')
      .max(60, 'Age must be at most 60'),
  });

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
          disabled={globalLock}
          onClick={() => {
            setEditRowId(null);
            setEditedRow({
              firstName: '',
              lastName: '',
              age: null,
            });
            setIsNewUser(true);
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
          <Formik
            initialValues={editedRow}
            onSubmit={async (values, { setFieldError }) => {
              console.log('VALL', values);
              if (values.firstName?.trim().length === 0) {
                setFieldError('firstName', "First Name can't be empty");
                return;
              }
              if (values.lastName?.trim().length === 0) {
                setFieldError('lastName', "Last Name can't be empty");
                return;
              }
              const sanitizedValues = {
                firstName: values.firstName?.trim(),
                lastName: values.lastName?.trim(),
                age: values.age,
              };
              console.log('san', sanitizedValues);
              if (isNewUser) {
                await createUserMutation({
                  variables: {
                    data: sanitizedValues,
                  },
                }).catch((error) => {
                  console.log('ERRRO');
                  const field =
                    error?.cause?.extensions?.error?.details?.errors?.[0]
                      ?.path?.[0];
                  const message =
                    error?.cause?.extensions?.error?.details?.errors?.[0]
                      ?.message;

                  if (field && message) {
                    setFieldError(field, message);
                  } else {
                    toast.error('Error while creating the user');
                  }

                  toast.error(
                    `${error?.cause?.extensions.error.details.errors[0].message} (${error?.cause?.extensions.error.details.errors[0].path[0]})` ||
                      'Error while creating the user',
                  );
                });
              } else {
                await updateUserMutation({
                  variables: {
                    documentId: editRowId,
                    data: editedRow,
                  },
                });
                setEditRowId(null);
                setEditedRow({});
              }
            }}
            enableReinitialize
            validationSchema={validationSchema}>
            {({
              handleSubmit,
              handleChange,
              values,
              errors,
              touched,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
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
                        {isNewUser && (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            {columns.map((column, index) => {
                              const value = editedRow[column.id];

                              return (
                                <TableCell key={column.id} align="left">
                                  <TextField
                                    variant="standard"
                                    fullWidth
                                    type={column.type}
                                    name={column.id}
                                    error={
                                      touched[column.id] &&
                                      Boolean(errors[column.id])
                                    }
                                    onPaste={(e) =>
                                      column.type === 'number'
                                        ? handlePaste(e)
                                        : {}
                                    }
                                    value={
                                      column.type === 'number' &&
                                      values[column.id] === 0
                                        ? ''
                                        : values[column.id] || ''
                                    }
                                    helperText={
                                      touched[column.id] && errors[column.id]
                                    }
                                    onChange={handleChange}
                                    autoFocus={index === 0}
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
                                  type="submit"
                                  onClick={() => console.log('VALUES', values)}>
                                  Create
                                </Button>
                                <Button
                                  color="primary"
                                  disabled={isCreating}
                                  onClick={() => {
                                    setEditedRow({});
                                    setIsNewUser(false);
                                  }}>
                                  Cancel
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}

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
                                    ) : column.format &&
                                      typeof value === 'number' ? (
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
                                        onClick={() => handleSubmit()}>
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
                                        disabled={globalLock}
                                        onClick={() => {
                                          setEditRowId(row.documentId);
                                          setEditedRow({
                                            firstName: row.firstName,
                                            lastName: row.lastName,
                                            age: row.age,
                                          });
                                          setIsNewUser(false);
                                        }}>
                                        Edit
                                      </Button>
                                      <IconButton
                                        size="small"
                                        color="info"
                                        disabled={globalLock}
                                        onClick={() =>
                                          handleOpenModal(row, 'view')
                                        }>
                                        <VisibilityIcon fontSize="small" />
                                      </IconButton>
                                      <Tooltip title="Delete User">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          disabled={globalLock}
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
                <Logger /> {/* This logs on any change */}
              </Form>
            )}
          </Formik>
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

