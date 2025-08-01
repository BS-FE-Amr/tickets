import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import DataDisplay from '../components/data-display';
import type { TodosData, TodosResponse } from '../types/todos.types';
import { useMemo, useState } from 'react';
import api from '../utils/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';

import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

  const { data, error, isLoading } = useQuery({
    queryKey: ['todos', page, rowsPerPage],
    queryFn: () =>
      api
        .get(`/auth/todos?limit=${rowsPerPage}&skip=${rowsPerPage * page}`)
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
    id: string,
    todo: string,
    completed: string,
    userId: string,
  ): TodosData {
    return { id, todo, completed, userId };
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
      data?.todos?.map((todo: TodosData) => {
        return createData(
          todo?.id,
          todo?.todo,
          todo?.completed ? '✅' : '❌',
          todo?.userId,
        );
      }) || []
    );
  }, [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleOpenModal = (id: number | null) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedId(null);
    setIsModalOpen(false);
  };

  const DeleteTodo = async () => {
    const { data } = await api.delete(`/auth/todos/${selectedId}`);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: DeleteTodo,
    onSuccess: (data) => {
      console.log(data);
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`Todo #${data.id} Deleted Successfully!`);
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

      <div className="mt-[24px] ">
        {/* Todos Table */}
        <DataDisplay<TodosResponse | null>
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
                              to={`/todos/${row.id}/edit`}>
                              Edit
                            </Button>
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => navigate(`/todos/${row.id}`)}
                              sx={{ mr: 1 }}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <Tooltip title="Delete Todo">
                              <IconButton
                                size="small"
                                color="error"
                                sx={{ mr: 1, textAlign: 'right' }}
                                onClick={() => handleOpenModal(Number(row.id))}>
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
              count={data?.total as number}
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
                Are you sure you want to delete todo #{selectedId}
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

