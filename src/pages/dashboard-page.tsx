import {
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
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';

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
          todo?.completed ? 'true' : 'false',
          todo?.userId,
        );
      }) || []
    );
  }, [data]);

  return (
    <div className="container mt-[24px]">
      {/* Todos Header */}
      <Typography variant="h5" fontWeight="fontWeightBold">
        Todos
      </Typography>
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
                        align={column.align}
                        style={{ minWidth: column.minWidth }}>
                        {column.label}
                      </TableCell>
                    ))}
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

export default DashboardPage;

