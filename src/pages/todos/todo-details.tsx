import { useQuery } from '@tanstack/react-query';
import type { TodosData } from '../../types/todos.types';
import { useParams } from 'react-router';
import DataDisplay from '../../components/data-display';
import { Box, Link, Paper, Typography } from '@mui/material';
import { fetchTodo } from '../../services/todos-service-';

const TodoDetails = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useQuery<TodosData>({
    queryKey: ['todos', id],
    queryFn: () => fetchTodo(String(id)),
  });

  return (
    <DataDisplay<TodosData | undefined>
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
                <Link href={`/todos/${id}/edit`}>Edit</Link>
              </div>
              <div className="mt-[24px]">
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Id:</Typography>
                  <Typography variant="body1">{data?.id}</Typography>
                </div>

                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Todo:</Typography>
                  <Typography variant="body1">{data?.todo}</Typography>
                </div>
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Completed:</Typography>
                  <Typography variant="body1">
                    {data?.completed ? 'True' : 'False'}
                  </Typography>
                </div>
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">UserId:</Typography>
                  <Typography variant="body1">{data?.userId}</Typography>
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

