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
import type {
  TodosData,
  TodosFilterValue,
  TodosResponse,
} from '../types/todos.types';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { deleteTodo, fetchTodos } from '../services/todos-service-';
import { useTodosContext } from '../contexts/todos-context';
import useDebounce from '../hooks/use-debounce';

interface Column {
  id: 'id' | 'todo' | 'completed' | 'userId';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const DashboardPage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const queryClient = useQueryClient();

  const { filterValue, setFilterValue, searchValue, setSearchValue } =
    useTodosContext();

  const handleChange = (event: SelectChangeEvent) => {
    setFilterValue(event.target.value as TodosFilterValue);
  };

  const { inputValue, setInputValue } = useDebounce(setSearchValue);

  const { data, error, isLoading } = useQuery<TodosResponse>({
    queryKey: ['todos', page, rowsPerPage, searchValue, filterValue],
    queryFn: () => fetchTodos(searchValue, filterValue, page, rowsPerPage),
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
    id: string,
    todo: string,
    completed: string,
    userId: string,
    documentId: string,
  ): TodosData {
    return { id, todo, completed, userId, documentId };
  }

  const columns: readonly Column[] = [
    { id: 'id', label: 'Id', minWidth: 170 },
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
      data?.data?.map((todo: TodosData) => {
        return createData(
          todo?.id,
          todo?.todo,
          todo?.completed ? '✅' : '❌',
          todo?.userId,
          todo?.documentId,
        );
      }) || []
    );
  }, [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TodosData | null>(null);

  const handleOpenModal = (row: TodosData) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTodo(String(selectedRow?.documentId)),
    onSuccess: (data) => {
      console.log(data);
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`Todo Deleted Successfully!`);
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

  const navigate = useNavigate();

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
          component={Link}
          to="/todos/new"
          variant="contained"
          color="primary">
          Add New Todo
        </Button>
      </Box>

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
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={'left'}>
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                        <TableCell align={'center'}>
                          <Box display="flex" gap={1}>
                            <Button
                              variant="outlined"
                              color="primary"
                              component={Link}
                              to={`/todos/${row.documentId}/edit`}>
                              Edit
                            </Button>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() =>
                                navigate(`/todos/${row.documentId}`)
                              }
                              sx={{ mr: 1 }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <Tooltip title="Delete Todo">
                              <IconButton
                                size="small"
                                color="error"
                                sx={{ mr: 1, textAlign: 'right' }}
                                onClick={() => handleOpenModal(row)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
              count={data?.meta.pagination.total as number}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description">
            <Box sx={style}>
              <Typography variant="h5" fontWeight="bold">
                Are you sure you want to delete todo #{selectedRow?.todo}
              </Typography>

              <div className="flex justify-between">
                <Button onClick={handleCloseModal} disabled={isPending}>
                  Close
                </Button>
                <Button onClick={() => mutate()} disabled={isPending}>
                  Delete
                </Button>
              </div>
            </Box>
          </Modal>
        </DataDisplay>
      </div>
    </div>
  );
};

export default DashboardPage;

