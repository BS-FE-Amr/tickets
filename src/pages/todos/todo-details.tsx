// import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import DataDisplay from '../../components/data-display';
import { Box, Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { FETCH_TODO } from '../../services/todos-service-gql';
import type { TodoItemResponse } from '../../types/todos-gql.types';

const TodoDetails = ({ todoId }: { todoId?: string }) => {
  const { id } = useParams();
  const todoFinalId = todoId || id;

  // const { data, error, isLoading } = useQuery<TodoItemResponse>({
  //   queryKey: ['todos', id],
  //   queryFn: () => fetchTodo(String(id)),
  // });

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<TodoItemResponse>(FETCH_TODO, {
    variables: {
      documentId: todoFinalId,
    },
  });

  return (
    <DataDisplay<TodoItemResponse | undefined>
      data={data}
      error={error?.message}
      isLoading={isLoading}>
      <div className="mt-[24px]">
        <div className="container">
          <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <div className="flex justify-between items-center">
                <Typography variant="h5" fontWeight="bold">
                  Todo
                </Typography>
                {/* <Link href={`/todos/${todoFinalId}/edit`}>Edit</Link> */}
              </div>
              <div className="mt-[24px]">
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Id:</Typography>
                  <Typography variant="body1">
                    {data?.todo.documentId}
                  </Typography>
                </div>

                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Todo:</Typography>
                  <Typography variant="body1">{data?.todo.todo}</Typography>
                </div>
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Completed:</Typography>
                  <Typography variant="body1">
                    {data?.todo.completed ? 'True' : 'False'}
                  </Typography>
                </div>
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Employee:</Typography>
                  <Typography variant="body1">
                    {data?.todo.employee.firstName}{' '}
                    {data?.todo.employee.lastName}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Box>
        </div>
      </div>
    </DataDisplay>
  );
};

export default TodoDetails;

