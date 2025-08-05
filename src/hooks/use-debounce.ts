import { useEffect, useState } from 'react';

const useDebounce = <T>(
  setSearchValue: React.Dispatch<React.SetStateAction<T>>,
  inititalValue: T,
) => {
  const [inputValue, setInputValue] = useState<T>(inititalValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('INPUT VALUE', inputValue, typeof inputValue);
      setSearchValue(inputValue);
    }, 500);

    return () => clearTimeout(timeout); // cleanup previous timeout
  }, [inputValue, setSearchValue]);

  return { inputValue, setInputValue };
};

export default useDebounce;

