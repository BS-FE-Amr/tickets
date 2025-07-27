import { useEffect, useState } from 'react';
import { useUsersContext } from './use-users-context';

const useUsersSearch = () => {
  const { setSearchValue } = useUsersContext();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [inputValue, setSearchValue]);

  return { inputValue, setInputValue };
};

export default useUsersSearch;

