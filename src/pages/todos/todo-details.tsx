// import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import DataDisplay from '../../components/data-display';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { FETCH_TODO } from '../../services/todos-service-gql';
import type { TodoItemResponse } from '../../types/todos-gql.types';

const TodoDetails = ({
  todoId,
  handleClose,
}: {
  todoId?: string;
  handleClose: () => void;
}) => {
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
    skip: !todoFinalId,
  });

  if (!todoFinalId) {
    return;
  }

  return (
    <>
      <DialogTitle>Ticket Details</DialogTitle>
      <DialogContent dividers>
        <DataDisplay<TodoItemResponse | undefined>
          data={data}
          error={error && error?.message}
          isLoading={isLoading}>
          <Typography>
            <strong>ID:</strong> {data?.todo.documentId}
          </Typography>
          <Typography>
            <strong>Ticket:</strong> {data?.todo.todo}
          </Typography>
          <Typography>
            <strong>Status:</strong>{' '}
            {data?.todo.completed ? 'Completed' : 'Not Completed'}
          </Typography>
          <Typography>
            <strong>User:</strong>
            {data?.todo?.employee
              ? `${data?.todo.employee?.firstName} ${data?.todo.employee?.lastName}`
              : 'No assigne yet'}
          </Typography>
        </DataDisplay>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default TodoDetails;

