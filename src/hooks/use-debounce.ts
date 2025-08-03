import { useEffect, useState } from 'react';

const useDebounce = (
  setSearchValue: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [inputValue, setSearchValue]);

  return { inputValue, setInputValue };
};

export default useDebounce;

