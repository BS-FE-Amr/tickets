import { useEffect, useMemo, useState } from 'react';
import { useTodosContext } from './use-todos-context';
import useTodos from './use-todos';
import { createData } from '../utils/helpers';

const useTodosTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { filterValue, searchValue } = useTodosContext();

  const { data, error, isLoading } = useTodos(
    page,
    rowsPerPage,
    filterValue,
    searchValue,
  );

  console.log('DATAIS', data);

  const rows = useMemo(() => {
    const newData = [...(data?.todos || [])];
    console.log('DATA ISSSSOOOOOOOOOOOOOOOOOOOOOOOO', newData);

    return (
      newData?.map((todo) => {
        return createData(
          todo?.id,
          todo?.todo,
          todo?.completed ? 'true' : 'false',
          todo?.userId,
        );
      }) || []
    );
  }, [data]);

  useEffect(() => {
    console.log('DATA ISSSS');
  }, [data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log('PAGE_CHANGE', newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  console.log('ROWS', rows);

  return {
    handleChangePage,
    handleChangeRowsPerPage,
    rows,
    rowsPerPage,
    page,
    data,
    error,
    isLoading,
  };
};

export default useTodosTable;

