import { useNavigate, useParams } from 'react-router';
import type { TodoItemResponse, TodosNewData } from '../../types/todos.types';
import DataDisplay from '../../components/data-display';
import toast from 'react-hot-toast';
import TodoForm from '../../components/todo-form';
import { fetchTodo, updateTodo } from '../../services/todos-service-';
import { FETCH_TODO, UPDATE_TODO } from '../../services/todos-service-gql';
import { useMutation, useQuery } from '@apollo/client';

const EditTodoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<TodoItemResponse>(FETCH_TODO, {
    variables: {
      documentId: id,
    },
  });

  const [
    mutate,
    { data: mutationData, loading: isPending, error: errorMutation },
  ] = useMutation(UPDATE_TODO, {
    refetchQueries: [
      'GetTodos',
      {
        query: FETCH_TODO,
        variables: { documentId: id },
      },
    ],
    onCompleted: (data) => {
      console.log(data);
      toast.success(`Todo Edited Successfully!`);
      navigate(`/todos/${data.updateTodo.documentId}`);
    },
  });

  // const { data, error, isLoading } = useQuery<TodoItemResponse>({
  //   queryKey: ['todos', id],
  //   queryFn: () => fetchTodo(String(id)),
  // });

  // const { mutate, isPending } = useMutation({
  //   mutationFn: ({ todo, completed, userId }: TodosNewData) =>
  //     updateTodo(String(id), { todo, completed, userId }),
  //   onSuccess: (data) => {
  //     console.log(data.data.documentId);
  //     queryClient.invalidateQueries({ queryKey: ['todos'] });
  //     toast.success(`Todo #${data.data.documentId} Edited Successfully!`);
  //     navigate(`/todos/${data.data.documentId}`);
  //   },
  // });

  return (
    <div className="container">
      <DataDisplay<TodoItemResponse | undefined>
        data={data}
        error={error?.message}
        isLoading={isLoading}>
        <TodoForm
          buttonValue={'Edit'}
          head={'Edit Todo'}
          isPending={isPending}
          mutate={mutate}
          type="edit"
          defaultValues={{
            todo: String(data?.todo.todo),
            completed: Boolean(data?.todo.completed),
            userId: String(data?.todo.userId),
          }}
          externalLink={`/todos/${id}`}
          externalText="View"
          id={id}
        />
      </DataDisplay>
    </div>
  );
};

export default EditTodoPage;

