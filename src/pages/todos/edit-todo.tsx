import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import api from '../../services/api';
import type { TodosData, TodosNewData } from '../../types/todos.types';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import TodoSchema from '../../models/todo-schema';
import DataDisplay from '../../components/data-display';
import toast from 'react-hot-toast';

const EditTodoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<TodosData>({
    queryKey: ['todos', id],
    queryFn: () => api.get(`/auth/todos/${id}`).then((res) => res.data),
  });

  const UpdateTodo = async ({ todo, completed, userId }: TodosNewData) => {
    const { data } = await api.put(`/auth/todos/${id}`, {
      todo: todo,
      completed: completed,
      userId: userId,
    });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateTodo,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`Todo #${data.id} Edited Successfully!`);
      navigate(`/todos/${data.id}`);
    },
    onError: (error) => {},
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
                  Edit Todo
                </Typography>
                <Link href={`/todos/${id}`}>View Original</Link>
              </div>
              <div className="mt-[24px]">
                <Formik
                  initialValues={{
                    todo: data?.todo,
                    completed: data?.completed,
                    userId: data?.userId,
                  }}
                  validationSchema={TodoSchema}
                  onSubmit={(values) => {
                    mutate({
                      todo: String(values.todo),
                      completed: String(values.completed),
                      userId: String(values.userId),
                    });
                  }}>
                  {({ values, handleChange, handleBlur, touched, errors }) => {
                    console.log(values);
                    return (
                      <Form>
                        <Box mb={2}>
                          <TextField
                            fullWidth
                            label="Todo"
                            name="todo"
                            value={values.todo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.todo && Boolean(errors.todo)}
                            helperText={touched.todo && errors.todo}
                            disabled={isPending}
                          />
                        </Box>

                        <Box mb={2}>
                          <TextField
                            fullWidth
                            label="User ID"
                            name="userId"
                            type="number"
                            value={values.userId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.userId && Boolean(errors.userId)}
                            helperText={touched.userId && errors.userId}
                            disabled={isPending}
                          />
                        </Box>

                        <Box mb={2}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="completed"
                                checked={!!values.completed}
                                onChange={handleChange}
                                disabled={isPending}
                              />
                            }
                            label="Completed"
                          />
                        </Box>

                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isPending}
                          fullWidth>
                          Edit
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </Paper>
          </Box>
        </div>
      </div>
    </DataDisplay>
  );
};

export default EditTodoPage;

