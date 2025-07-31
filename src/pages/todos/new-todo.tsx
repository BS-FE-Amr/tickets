import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import TodoForm from '../../components/todo-form';
import { createTodo } from '../../services/todos-service-';

const NewTodoPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`New Todo Added Successfully!`);
      navigate(`/dashboard`);
    },
  });

  return (
    <TodoForm
      buttonValue={'Add'}
      head={'New Todo'}
      isPending={isPending}
      mutate={mutate}
      defaultValues={{ todo: '', completed: false, userId: '' }}
    />
  );
};

export default NewTodoPage;

