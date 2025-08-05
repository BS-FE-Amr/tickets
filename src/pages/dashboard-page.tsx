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
  Typography,
  type SelectChangeEvent,
} from '@mui/material';
import DataDisplay from '../components/data-display';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

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
  UPDATE_TODO,
} from '../services/todos-service-gql';
import type {
  TodosNewData,
  TodosResponse,
  TodosData,
  TodosFilterValue,
} from '../types/todos-gql.types';
import type { FetchPaginatedFilteredSearch } from '../types/general.types';
import TodoDetails from './todos/todo-details';

interface Column {
  id: 'todo' | 'completed' | 'userId';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const DashboardPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { filterValue, setFilterValue, searchValue, setSearchValue } =
    useTodosContext();

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'todo') {
      setInputValue('');
    } else if (event.target.value === 'completed') {
      setInputValue(false);
    } else if (event.target.value === 'userId') {
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
    if (filterValue === 'userId') {
      if (!searchValue) {
        setFilters({});
      } else {
        setFilters({
          [filterValue]: { contains: Number(searchValue) },
        });
      }
    } else if (filterValue === 'completed') {
      setFilters({ [filterValue]: { eq: searchValue } });
    } else {
      setFilters({ [filterValue]: { contains: searchValue } });
    }
  }, [searchValue]);

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<TodosResponse, FetchPaginatedFilteredSearch>(FETCH_TODOS, {
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
    todo: string,
    completed: boolean,
    userId: number,
    documentId: string,
  ): TodosData {
    return { todo, completed, userId, documentId };
  }

  const columns: readonly Column[] = [
    // { id: 'id', label: 'Id', minWidth: 170 },
    { id: 'todo', label: 'Todo', minWidth: 100 },
    {
      id: 'completed',
      label: 'Completed',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'userId',
      label: 'User ID',
      minWidth: 170,
      align: 'right',
    },
  ];

  const rows = useMemo(() => {
    return (
      data?.todos_connection?.nodes?.map((todo: TodosData) => {
        return createData(
          todo?.todo,
          todo?.completed,
          todo?.userId,
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
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  const [
    deleteTodoMutation,
    { loading: isDeleting, error: errorDeletingTodo },
  ] = useMutation(DELETE_TODO, {
    refetchQueries: ['GetTodos'],
    onCompleted: () => {
      handleCloseModal();
      toast.success(`Todo Deleted Successfully!`);
    },
    onError: () => {
      toast.error(
        errorDeletingTodo?.message || 'Error while deleting the todo',
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

  const [newTodo, setNewTodo] = useState<null | TodosNewData>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<TodosData>>({});
  const [modalType, setModalType] = useState<null | 'view' | 'delete'>(null);
  const [selectedRow, setSelectedRow] = useState<TodosData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [
    createTodoMutation,
    { loading: isCreating, error: errorCreatingTodo },
  ] = useMutation(CREATE_TODO, {
    refetchQueries: ['GetTodos'],
    onCompleted: () => {
      setNewTodo(null);
      toast.success(`New Todo Added Successfully!`);
    },
    onError: () => {
      toast.error(
        errorCreatingTodo?.message || 'Error while creating the todo',
      );
    },
  });

  const [updateTodoMutation, { loading: isUpdating, error: errorUpdating }] =
    useMutation(UPDATE_TODO, {
      refetchQueries: [
        'GetTodos',
        {
          query: FETCH_TODO,
          variables: { documentId: editRowId },
        },
      ],
      onCompleted: (data) => {
        console.log(data);
        toast.success(`Todo Updated Successfully!`);
      },
      onError: () => {
        toast.error(
          errorUpdating?.message ||
            'Something went wrong while updating the todo.',
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

  const isBoolean = filterValue === 'completed';
  const isNumber = filterValue === 'userId';

  return (
    <div className="container mt-[24px]">
      {/* Todos Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
        <Typography variant="h4">Todos List</Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={!!newTodo}
          onClick={() => {
            setNewTodo({
              todo: '',
              completed: false,
              userId: null,
            });
          }}>
          Add New Todo
        </Button>
      </Box>

      <div className="flex gap-[24px] mb-[24px]">
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
              <MenuItem value={'true'}>True</MenuItem>
              <MenuItem value={'false'}>False</MenuItem>
            </Select>
          </FormControl>
        ) : (
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
        )}

        {/* Users Filter dropdown */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filterValue}
            label="Filter"
            onChange={handleChange}>
            <MenuItem value={'todo'}>Todo</MenuItem>
            <MenuItem value={'completed'}>Completed</MenuItem>
            <MenuItem value={'userId'}>User Id</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="mt-[24px] ">
        {/* Todos Table */}
        <DataDisplay<TodosResponse | undefined>
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
                  {rows.map((row: TodosData) => {
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
                          const isBoolean = typeof value === 'boolean';

                          return (
                            <TableCell key={column.id} align="left">
                              {isEditing ? (
                                isBoolean ? (
                                  <Select
                                    value={
                                      editedValue ?? value ? 'true' : 'false'
                                    }
                                    onChange={(e) =>
                                      setEditedRow((prev) => ({
                                        ...prev,
                                        [column.id]: e.target.value === 'true',
                                      }))
                                    }
                                    variant="standard"
                                    fullWidth>
                                    <MenuItem value="true">True</MenuItem>
                                    <MenuItem value="false">False</MenuItem>
                                  </Select>
                                ) : (
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
                                )
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
                                    await updateTodoMutation({
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
                                      todo: row.todo,
                                      userId: row.userId,
                                      completed: row.completed,
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
                                <Tooltip title="Delete Todo">
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
                  {newTodo && (
                    <TableRow hover role="checkbox" tabIndex={-1}>
                      {columns.map((column) => {
                        const value = newTodo[column.id];
                        const isBoolean = typeof value === 'boolean';

                        return (
                          <TableCell key={column.id} align="left">
                            {isBoolean ? (
                              <Select
                                value={value ? 'true' : 'false'}
                                onChange={(e) =>
                                  setNewTodo((prev) =>
                                    !prev
                                      ? prev
                                      : {
                                          ...prev,
                                          [column.id]:
                                            e.target.value === 'true',
                                        },
                                  )
                                }
                                fullWidth
                                variant="standard">
                                <MenuItem value="true">True</MenuItem>
                                <MenuItem value="false">False</MenuItem>
                              </Select>
                            ) : (
                              <TextField
                                variant="standard"
                                fullWidth
                                type={
                                  typeof value === 'number' ? 'number' : 'text'
                                }
                                value={value}
                                onChange={(e) =>
                                  setNewTodo((prev) =>
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
                            onClick={async () =>
                              await createTodoMutation({
                                variables: {
                                  data: newTodo,
                                },
                              })
                            }>
                            Create
                          </Button>
                          <Button
                            color="primary"
                            disabled={isCreating}
                            onClick={() => setNewTodo(null)}>
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
              count={data?.todos_connection?.pageInfo?.total as number}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          <Modal
            open={isModalOpen}
            onClose={handleModalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description">
            {modalType === 'view' ? (
              <TodoDetails todoId={selectedRow?.documentId} />
            ) : (
              <Box sx={style}>
                <Typography variant="h5" fontWeight="bold">
                  Are you sure you want to delete todo #{selectedRow?.todo}
                </Typography>

                <div className="flex justify-between">
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
                </div>
              </Box>
            )}
          </Modal>
        </DataDisplay>
      </div>
    </div>
  );
};

export default DashboardPage;

