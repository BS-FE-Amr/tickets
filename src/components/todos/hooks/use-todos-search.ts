import { useEffect, useState } from 'react';
import { useTodosContext } from './use-todos-context';

const useTodosSearch = () => {
  const { setSearchValue } = useTodosContext();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [inputValue, setSearchValue]);

  return { inputValue, setInputValue };
};

export default useTodosSearch;

