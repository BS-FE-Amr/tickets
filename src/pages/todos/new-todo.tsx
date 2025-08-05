import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import TodoForm from '../../components/todo-form';
import { createTodo } from '../../services/todos-service-';
import { CREATE_TODO } from '../../services/todos-service-gql';
import { useMutation } from '@apollo/client';

const NewTodoPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // const { mutate, isPending } = useMutation({
  //   mutationFn: createTodo,
  //   onSuccess: (data) => {
  //     console.log(data);
  //     queryClient.invalidateQueries({ queryKey: ['todos'] });
  //     toast.success(`New Todo Added Successfully!`);
  //     navigate(`/dashboard`);
  //   },
  // });

  const [mutate, { data, loading: isPending, error }] = useMutation(
    CREATE_TODO,
    {
      refetchQueries: ['GetTodos'],
      onCompleted: (data) => {
        toast.success(`New Todo Added Successfully!`);
        navigate(`/dashboard`);
      },
    },
  );

  return (
    <TodoForm
      buttonValue={'Add'}
      head={'New Todo'}
      isPending={isPending}
      mutate={mutate}
      type="new"
      defaultValues={{ todo: '', completed: false, userId: '' }}
    />
  );
};

export default NewTodoPage;

