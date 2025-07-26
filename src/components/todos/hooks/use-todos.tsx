import { useCallback, useEffect, useState } from 'react';
import type { TodosFilterValue, TodosResponse } from '../types/todos.types';

const useTodos = (
  page: number,
  pageSize: number,
  filterKey: TodosFilterValue,
  searchValue: string,
) => {
  const [data, setData] = useState<TodosResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `https://dummyjson.com/todos?limit=${pageSize}&skip=${pageSize * page}`,
      );
      if (!res.ok) {
        throw new Error('Failed to fetch todos');
      }

      const resData = await res.json();

      // if (filterKey && searchValue) {
      //   resData = resData.todos.filter((todo: string) =>
      //     String(todo)
      //       .toLowerCase()
      //       .includes(String(searchValue).toLowerCase()),
      //   );
      // }

      setData(resData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred'); // fallback
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, filterKey, searchValue]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { data, error, isLoading };
};

export default useTodos;

