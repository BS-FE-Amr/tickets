import type { TodosNewData } from './../types/todos.types';
import api from '../utils/api';

export const fetchTodos = async (
  searchValue: string,
  filterValue: string,
  page: number,
  rowsPerPage: number,
) => {
  return await api
    .get(
      filterValue && searchValue
        ? `/todos?filters[${filterValue}][$contains]=${searchValue}&pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`
        : `/todos?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`,
    )
    .then((res) => res.data);
};

export const fetchTodo = async (documentId: string) => {
  return await api.get(`/todos/${documentId}`).then((res) => res.data);
};

export const updateTodo = async (
  documentId: string,
  { todo, completed, userId }: TodosNewData,
) => {
  const { data } = await api.put(`/todos/${documentId}`, {
    data: {
      todo: todo,
      completed: completed,
      userId: userId,
    },
  });
  return data;
};

export const createTodo = async ({ todo, completed, userId }: TodosNewData) => {
  const { data } = await api.post('/todos', {
    data: {
      todo: todo,
      completed: completed,
      userId: userId,
    },
  });
  return data;
};

export const deleteTodo = async (documentId: string) => {
  const { data } = await api.delete(`/todos/${documentId}`);
  return data;
};

// pie Chart - mui

