import * as Yup from 'yup';

const TodoSchema = Yup.object().shape({
  todo: Yup.string().required('Todo is required'),
  completed: Yup.boolean().required('Completed State is Required'),
  userId: Yup.number().required('User Id'),
});

export default TodoSchema;

