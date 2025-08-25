import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
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
import DataDisplay from '../components/data-display';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';

import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTodosContext } from '../contexts/todos-context';
import useDebounce from '../hooks/use-debounce';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_TODO,
  DELETE_TODO,
  FETCH_TODO,
  FETCH_TODOS,
  GET_TODO_ASSIGNED_STATS,
  GET_TODO_STATS,
  UPDATE_TODO,
} from '../services/todos-service-gql';
import type {
  TodosResponse,
  TodosData,
  TodosFilterValue,
  TodosStatusAssignedResponse,
  TodosStatusResponse,
} from '../types/todos-gql.types';
import type { FetchPaginatedFilteredSearch } from '../types/general.types';
import TodoDetails from './todos/todo-details';
import { Form, Formik } from 'formik';
import { handlePaste } from '../utils/helper';
import DropdownWithPagination from '../components/users-fetch';
// import Logger from '../components/logger';
import PieChart from '../components/todo-chart';
import type { UsersData } from '../types/users-gql.types';

interface Column {
  id: 'todo' | 'completed' | 'employee';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
  type: 'string' | 'boolean' | 'number' | 'select';
}

const DashboardPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { filterValue, setFilterValue, searchValue, setSearchValue } =
    useTodosContext();

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'completed') {
      setInputValue(false);
    } else {
      setInputValue('');
    }
    setFilterValue(event.target.value as TodosFilterValue);
  };

  const { inputValue, setInputValue } = useDebounce<string | number | boolean>(
    setSearchValue,
    '',
  );

  // const { data, error, isLoading } = useQuery<TodosResponse>({
  //   queryKey: ['todos', page, rowsPerPage, searchValue, filterValue],
  //   queryFn: () => fetchTodos(searchValue, filterValue, page, rowsPerPage),
  // });

  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (filterValue === 'employee') {
      if (!searchValue) {
        setFilters({});
      } else {
        const [first, last] = String(searchValue).split(' ');
        setFilters({
          and: [
            {
              employee: {
                firstName: { contains: first || '' },
              },
            },
            {
              employee: {
                lastName: { contains: last || '' },
              },
            },
          ],
        });
      }
    } else if (filterValue === 'completed') {
      setFilters({ [filterValue]: { eq: searchValue } });
    } else {
      setFilters({ [filterValue]: { contains: searchValue } });
    }
  }, [searchValue]);

  const queryVariables = useMemo(
    () => ({
      page: page + 1,
      pageSize: rowsPerPage,
      filters,
    }),
    [page, rowsPerPage, filters],
  );

  useEffect(() => {
    console.log('Page changed to:', page);
  }, [page]);

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<TodosResponse, FetchPaginatedFilteredSearch>(FETCH_TODOS, {
    variables: queryVariables,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    console.log('newPage', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(
    todo: string,
    completed: boolean,
    employee: UsersData,
    documentId: string,
  ): TodosData {
    return {
      todo,
      completed,
      employee: employee,
      documentId,
    };
  }

  const columns: readonly Column[] = [
    // { id: 'id', label: 'Id', minWidth: 170 },
    { id: 'todo', label: 'Ticket', minWidth: 170, type: 'string' },
    {
      id: 'completed',
      label: 'Status',
      minWidth: 170,
      align: 'right',
      type: 'boolean',
    },
    {
      id: 'employee',
      label: 'Assigne',
      minWidth: 170,
      align: 'right',
      type: 'select',
    },
  ];

  const rows = useMemo(() => {
    return (
      data?.todos_connection?.nodes?.map((todo: TodosData) => {
        return createData(
          todo?.todo,
          todo?.completed,
          todo?.employee,
          todo?.documentId,
        );
      }) || []
    );
  }, [data]);

  const handleOpenModal = (row: TodosData, type: 'view' | 'delete') => {
    setSelectedRow(row);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
  };

  const [
    deleteTodoMutation,
    { loading: isDeleting, error: errorDeletingTodo },
  ] = useMutation(DELETE_TODO, {
    refetchQueries: [
      'GetTodos',
      GET_TODO_STATS,
      { query: GET_TODO_ASSIGNED_STATS },
    ],
    onCompleted: () => {
      handleCloseModal();
      toast.success(`Ticket Deleted Successfully!`);
    },
    onError: () => {
      toast.error(
        errorDeletingTodo?.message || 'Error while deleting the todo',
      );
    },
  });

  // const style = {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: 'translate(-50%, -50%)',
  //   width: 400,
  //   bgcolor: 'background.paper',
  //   border: '2px solid #000',
  //   boxShadow: 24,
  //   p: 4,
  // };

  const [isNewTodo, setIsNewTodo] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<TodosData>>({});
  const [modalType, setModalType] = useState<null | 'view' | 'delete'>(null);
  const [selectedRow, setSelectedRow] = useState<TodosData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const globalLock = !!(isNewTodo || editRowId);

  const [
    createTodoMutation,
    { loading: isCreating, error: _errorCreatingTodo },
  ] = useMutation(CREATE_TODO, {
    refetchQueries: [
      'GetTodos',
      GET_TODO_STATS,
      { query: GET_TODO_ASSIGNED_STATS },
    ],
    onCompleted: () => {
      setIsNewTodo(false);
      setEditedRow({});
      setEditRowId(null);
      toast.success(`New Todo Added Successfully!`);
    },
  });

  const [updateTodoMutation, { loading: isUpdating, error: errorUpdating }] =
    useMutation(UPDATE_TODO, {
      refetchQueries: [
        'GetTodos',
        GET_TODO_STATS,
        { query: GET_TODO_ASSIGNED_STATS },
        {
          query: FETCH_TODO,
          variables: { documentId: editRowId },
        },
      ],
      onCompleted: () => {
        toast.success(`Ticket Updated Successfully!`);
      },
      onError: () => {
        toast.error(
          errorUpdating?.message ||
            'Something went wrong while updating the todo.',
        );
      },
    });

  const handleModalClose = () => {
    setIsModalOpen(false);
    // setModalType(null);
    if (selectedRow) {
      setSelectedRow(null);
    }
  };

  const isBoolean = filterValue === 'completed';
  const isNumber = false;

  const validationSchema = Yup.object({
    completed: Yup.boolean().required('Completed State is required'),
    todo: Yup.string().required('Todo is required'),
  });

  const handleUpdateTodo = async (values: Partial<TodosData>) => {
    console.log('VALLL', values);
    await updateTodoMutation({
      variables: {
        documentId: editRowId,
        data: {
          todo: values.todo,
          completed: values.completed,
          employee: values.employee?.documentId,
        },
      },
    });
    setEditRowId(null);
    setEditedRow({});
  };

  const {
    data: statusData,
    loading: isLoadingStatus,
    error: errorStatus,
  } = useQuery<TodosStatusResponse>(GET_TODO_STATS);

  const {
    data: statusAssignedData,
    loading: isLoadingStatusAssigned,
    error: errorStatusAssigned,
  } = useQuery<TodosStatusAssignedResponse>(GET_TODO_ASSIGNED_STATS);

  const chartTodosData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Tickets',
        data: [
          Number(statusData?.todoStats.completed),
          Number(statusData?.todoStats.notCompleted) || 0,
        ],
        backgroundColor: ['#0f7037', '#910929'],
      },
    ],
  };

  const chartTodosAssignedData = {
    labels: ['Assigned', 'Not Assigned'],
    datasets: [
      {
        label: 'Users',
        data: [
          Number(statusAssignedData?.employeeAssignmentStats.assignedEmployees),
          Number(
            statusAssignedData?.employeeAssignmentStats.unassignedEmployees,
          ),
        ],
        backgroundColor: ['#0f7037', '#910929'],
      },
    ],
  };

  //

  return (
    <Container sx={{ mt: 3 }}>
      {/* Chart */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          mt: 4,
          mb: 10,
          flexWrap: 'wrap',
        }}>
        <PieChart<TodosStatusResponse>
          chartData={chartTodosData}
          data={statusData}
          error={errorStatus}
          head={'Tickets Percentages'}
          isLoading={isLoadingStatus}
        />

        <PieChart<TodosStatusAssignedResponse>
          chartData={chartTodosAssignedData}
          data={statusAssignedData}
          error={errorStatusAssigned}
          head={'Users Assigned'}
          isLoading={isLoadingStatusAssigned}
        />
      </Box>

      {/* Todos Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
        <Typography variant="h4">Tickets List</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={globalLock}
          onClick={() => {
            setEditRowId(null);
            setEditedRow({
              todo: '',
              completed: false,
              employee: undefined,
            });
            setIsNewTodo(true);
          }}>
          Add New Ticket
        </Button>
      </Box>

      <Box display="flex" gap="24px" mb="24px">
        {/* Users Search */}
        {isBoolean ? (
          <FormControl fullWidth>
            <InputLabel id="bool-label">Value</InputLabel>
            <Select
              labelId="bool-label"
              id="bool-select"
              value={
                inputValue === true
                  ? 'true'
                  : inputValue === false
                  ? 'false'
                  : ''
              }
              label="Value"
              onChange={(e) => {
                console.log(e.target.value);
                setInputValue(e.target.value === 'true' ? true : false);
              }}>
              <MenuItem value={'true'}>Completed</MenuItem>
              <MenuItem value={'false'}>Not Completed</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            id="outlined-basic"
            label="Search"
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
        )}

        {/* Users Filter dropdown */}
        <FormControl sx={{ width: '240px' }}>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterValue}
            label="Filter"
            onChange={handleChange}>
            <MenuItem value={'todo'}>Ticket</MenuItem>
            <MenuItem value={'completed'}>Status</MenuItem>
            <MenuItem value={'employee'}>Assigne</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box mt={'24px'}>
        {/* Todos Table */}
        <DataDisplay<TodosResponse | undefined>
          data={data}
          error={error?.message}
          isLoading={isLoading}>
          <Formik
            initialValues={editedRow}
            onSubmit={async (values, { setFieldError }) => {
              console.log('VALL', values);
              if (values.todo?.trim().length === 0) {
                setFieldError('todo', "Todo can't be empty");
                return;
              }
              const sanitizedValues = {
                todo: values.todo?.trim(),
                completed: String(values.completed) === 'true' ? true : false,
                employee: values.employee,
              };
              if (isNewTodo) {
                await createTodoMutation({
                  variables: {
                    data: {
                      todo: sanitizedValues.todo,
                      completed: sanitizedValues.completed,
                      employee: sanitizedValues.employee?.documentId,
                    },
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
                    toast.error('Error while creating the todo');
                  }

                  toast.error(
                    `${error?.cause?.extensions.error.details.errors[0].message} (${error?.cause?.extensions.error.details.errors[0].path[0]})` ||
                      'Error while creating the todo',
                  );
                });
              } else {
                handleUpdateTodo(sanitizedValues);
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
                    <Table
                      stickyHeader
                      aria-label="sticky table"
                      sx={{ tableLayout: 'fixed', width: '100%' }}>
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
                              width: '240px',
                            }}>
                            {'Actions'}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {isNewTodo && (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            {columns.map((column, index: number) => {
                              const value = editedRow[column.id];
                              const isBoolean = typeof value === 'boolean';
                              const isSelect = column.type === 'select';

                              return (
                                <TableCell key={column.id} align="left">
                                  {isBoolean ? (
                                    <FormControl fullWidth>
                                      <Select
                                        onChange={handleChange}
                                        fullWidth
                                        name="completed"
                                        value={
                                          String(values.completed) === 'true'
                                            ? 'true'
                                            : 'false'
                                        }
                                        error={
                                          touched.completed &&
                                          Boolean(errors.completed)
                                        }
                                        // onBlur={handleBlur}
                                        variant="standard">
                                        <MenuItem value="true">
                                          Completed
                                        </MenuItem>
                                        <MenuItem value="false">
                                          Not Completed
                                        </MenuItem>
                                      </Select>
                                      {touched.completed &&
                                        errors.completed && (
                                          <FormHelperText>
                                            {errors.completed}
                                          </FormHelperText>
                                        )}
                                    </FormControl>
                                  ) : isSelect ? (
                                    <DropdownWithPagination
                                      defaultItem={
                                        typeof value !== 'string'
                                          ? value
                                          : undefined
                                      }
                                      isEditing={true}
                                      setValue={(val: UsersData | null) =>
                                        setFieldValue('employee', val)
                                      }
                                    />
                                  ) : (
                                    <TextField
                                      variant="standard"
                                      onPaste={(e) =>
                                        column.type === 'number'
                                          ? handlePaste(
                                              e as React.ClipboardEvent<HTMLInputElement>,
                                            )
                                          : {}
                                      }
                                      fullWidth
                                      autoFocus={index === 0}
                                      name={column.id}
                                      value={
                                        column.type === 'number' &&
                                        Number(values[column.id]) === 0
                                          ? ''
                                          : values[column.id] || ''
                                      }
                                      error={
                                        touched[column.id] &&
                                        Boolean(errors[column.id])
                                      }
                                      // onBlur={(e) => {
                                      //   handleBlur(e);
                                      // }}
                                      onChange={handleChange}
                                      helperText={
                                        touched[column.id] && errors[column.id]
                                      }
                                      type={column.type}
                                    />
                                  )}
                                </TableCell>
                              );
                            })}
                            <TableCell align={'center'}>
                              <Box display="flex" gap={1}>
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  disabled={isCreating}
                                  type="submit">
                                  Create
                                </Button>
                                <Button
                                  color="primary"
                                  disabled={isCreating}
                                  onClick={() => {
                                    setEditedRow({});
                                    setIsNewTodo(false);
                                  }}>
                                  Cancel
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}

                        {rows.map((row: TodosData) => {
                          const isEditing = editRowId === row.documentId;

                          return (
                            <TableRow
                              hover
                              role="checkbox"
                              tabIndex={-1}
                              key={row.documentId}>
                              {columns.map((column, index: number) => {
                                const value = row[column.id];
                                const isBoolean = column.type === 'boolean';
                                const isSelect = column.type === 'select';

                                return (
                                  <TableCell
                                    key={column.id}
                                    align="left"
                                    style={{
                                      minWidth: column.minWidth,
                                    }}>
                                    {isEditing ? (
                                      isBoolean ? (
                                        <FormControl fullWidth>
                                          <Select
                                            name="completed"
                                            value={
                                              String(values.completed) ===
                                                'true' ||
                                              values.completed === true
                                                ? 'true'
                                                : 'false'
                                            }
                                            error={
                                              touched.completed &&
                                              Boolean(errors.completed)
                                            }
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            variant="standard"
                                            fullWidth>
                                            <MenuItem value="true">
                                              Completed
                                            </MenuItem>
                                            <MenuItem value="false">
                                              Not Completed
                                            </MenuItem>
                                          </Select>
                                          {touched.completed &&
                                            errors.completed && (
                                              <FormHelperText>
                                                {errors.completed}
                                              </FormHelperText>
                                            )}
                                        </FormControl>
                                      ) : isSelect ? (
                                        <DropdownWithPagination
                                          defaultItem={
                                            typeof value !== 'string' &&
                                            typeof value !== 'boolean'
                                              ? value
                                              : undefined
                                          }
                                          isEditing={isEditing}
                                          setValue={(val: UsersData | null) =>
                                            setFieldValue('employee', val)
                                          }
                                        />
                                      ) : (
                                        <TextField
                                          name={column.id}
                                          value={values[column.id]}
                                          onChange={handleChange}
                                          variant="standard"
                                          autoFocus={index === 0}
                                          onPaste={handlePaste}
                                          error={
                                            touched[column.id] &&
                                            Boolean(errors[column.id])
                                          }
                                          helperText={
                                            touched[column.id] &&
                                            errors[column.id]
                                          }
                                          onBlur={(e) => {
                                            handleBlur(e);
                                          }}
                                          type={
                                            typeof value === 'number'
                                              ? 'number'
                                              : 'text'
                                          }
                                          fullWidth
                                        />
                                      )
                                    ) : column.format &&
                                      typeof value === 'number' ? (
                                      column.format(value)
                                    ) : isSelect ? (
                                      <>
                                        <DropdownWithPagination
                                          defaultItem={
                                            typeof value !== 'string' &&
                                            typeof value !== 'boolean'
                                              ? value
                                              : undefined
                                          }
                                          isEditing={isEditing}
                                          setValue={(val: UsersData | null) =>
                                            setFieldValue('employee', val)
                                          }
                                        />
                                      </>
                                    ) : isBoolean ? (
                                      value === true ? (
                                        'Completed'
                                      ) : (
                                        'Not Completed'
                                      )
                                    ) : (
                                      String(value)
                                    )}
                                  </TableCell>
                                );
                              })}

                              <TableCell
                                align="left"
                                style={{
                                  fontWeight: 'bold',
                                  width: '240px',
                                }}>
                                <Box display="flex" gap={1}>
                                  {isEditing ? (
                                    <>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        disabled={isUpdating}
                                        type="button"
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
                                        type="button"
                                        disabled={globalLock}
                                        onClick={() => {
                                          setEditRowId(row.documentId);
                                          setEditedRow({
                                            todo: row.todo,
                                            employee: row.employee,
                                            completed: row.completed,
                                          });
                                          setIsNewTodo(false);
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
                                      <Tooltip title="Delete Todo">
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
                    count={data?.todos_connection?.pageInfo?.total as number}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                {/* <Logger />  */}
              </Form>
            )}
          </Formik>

          <Dialog open={isModalOpen} onClose={handleModalClose}>
            {modalType === 'view' ? (
              <TodoDetails
                todoId={selectedRow?.documentId}
                handleClose={handleModalClose}
              />
            ) : (
              selectedRow && (
                <>
                  <DialogTitle>Delete Ticket</DialogTitle>
                  <DialogContent dividers>
                    <Typography>
                      Are you sure you want to delete Ticket #
                      {selectedRow?.todo}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseModal} disabled={isDeleting}>
                      Close
                    </Button>
                    <Button
                      onClick={async () => {
                        await deleteTodoMutation({
                          variables: {
                            documentId: selectedRow?.documentId,
                          },
                        });
                      }}
                      disabled={isDeleting}>
                      Delete
                    </Button>
                  </DialogActions>
                </>
              )
            )}
          </Dialog>
        </DataDisplay>
      </Box>
    </Container>
  );
};

export default DashboardPage;

