import { Formik, Form } from 'formik';
import TodoSchema from '../../models/todo-schema';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { useNavigate } from 'react-router';
import type { TodosNewData } from '../../types/todos.types';
import toast from 'react-hot-toast';

const NewTodoPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const AddTodo = async ({ todo, completed, userId }: TodosNewData) => {
    const { data } = await api.post('/auth/todos/add', {
      todo: todo,
      completed: completed,
      userId: userId,
    });
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: AddTodo,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`New Todo Added Successfully!`);
      navigate(`/dashboard`);
    },
    onError: (error) => {},
  });

  return (
    <div className="mt-[24px]">
      <div className="container">
        <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold">
              New Todo
            </Typography>
            <div className="mt-[24px]">
              <Formik
                initialValues={{ todo: '', completed: false, userId: '' }}
                validationSchema={TodoSchema}
                onSubmit={(values) => {
                  mutate({
                    todo: values.todo,
                    completed: String(values.completed),
                    userId: values.userId,
                  });
                }}>
                {({ values, handleChange, handleBlur, touched, errors }) => (
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
                            checked={values.completed}
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
                      Submit
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default NewTodoPage;

