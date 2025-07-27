import { useCallback, useEffect, useState } from 'react';
import type { UsersFilterValue, UsersResponse } from '../types/users.types';
import { useCustomFetch } from '../../../hooks/use-custom-fetch';

const useUsers = (
  page: number,
  pageSize: number,
  filterKey: UsersFilterValue,
  searchValue: string,
) => {
  const customFetch = useCustomFetch();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const resData = await customFetch<UsersResponse>(
        filterKey && searchValue
          ? `https://dummyjson.com/auth/users/filter?limit=${pageSize}&skip=${
              pageSize * page
            }&key=${filterKey}&value=${searchValue}`
          : `https://dummyjson.com/auth/users?limit=${pageSize}&skip=${
              pageSize * page
            }`,
      );

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
    fetchUsers();
  }, [fetchUsers]);

  return { data, error, isLoading };
};

export default useUsers;

