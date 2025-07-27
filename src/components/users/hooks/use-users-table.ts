import { useEffect, useMemo, useState } from 'react';
import { useUsersContext } from './use-users-context';
import useUsers from './use-users';
import { createData } from '../utils/helpers';

const useUsersTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { filterValue, searchValue } = useUsersContext();

  const { data, error, isLoading } = useUsers(
    page,
    rowsPerPage,
    filterValue,
    searchValue,
  );

  console.log('DATAIS', data);

  const rows = useMemo(() => {
    const newData = [...(data?.users || [])];
    console.log('DATA ISSSSOOOOOOOOOOOOOOOOOOOOOOOO', newData);

    return (
      newData?.map((user) => {
        return createData(user?.id, user?.firstName, user?.lastName, user?.age);
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

export default useUsersTable;

