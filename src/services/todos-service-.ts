import type { TodosNewData } from './../types/todos.types';
import api from '../utils/api';

export const fetchTodo = (id: string) => {
  return api.get(`/auth/todos/${id}`).then((res) => res.data);
};

export const updateTodo = async (
  id: string,
  { todo, completed, userId }: TodosNewData,
) => {
  const { data } = await api.put(`/auth/todos/${id}`, {
    todo: todo,
    completed: completed,
    userId: userId,
  });
  return data;
};

export const createTodo = async ({ todo, completed, userId }: TodosNewData) => {
  const { data } = await api.post('/auth/todos/add', {
    todo: todo,
    completed: completed,
    userId: userId,
  });
  return data;
};

// pie Chart - mui

