import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import type { TodosData, TodosNewData } from '../../types/todos.types';
import DataDisplay from '../../components/data-display';
import toast from 'react-hot-toast';
import TodoForm from '../../components/todo-form';
import { fetchTodo, updateTodo } from '../../services/todos-service-';

const EditTodoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<TodosData>({
    queryKey: ['todos', id],
    queryFn: () => fetchTodo(String(id)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ todo, completed, userId }: TodosNewData) =>
      updateTodo(String(id), { todo, completed, userId }),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success(`Todo #${data.id} Edited Successfully!`);
      navigate(`/todos/${data.id}`);
    },
  });

  return (
    <div className="container">
      <DataDisplay<TodosData | undefined>
        data={data}
        error={error?.message}
        isLoading={isLoading}>
        <TodoForm
          buttonValue={'Edit'}
          head={'Edit Todo'}
          isPending={isPending}
          mutate={mutate}
          defaultValues={{
            todo: String(data?.todo),
            completed: Boolean(data?.completed),
            userId: String(data?.userId),
          }}
          externalLink={`/todos/${id}`}
          externalText="View"
        />
      </DataDisplay>
    </div>
  );
};

export default EditTodoPage;

