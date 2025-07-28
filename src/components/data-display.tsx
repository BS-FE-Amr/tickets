import type { DataDisplayInterface } from '../types/data-display.types';

const DataDisplay = <T,>({
  isLoading,
  error,
  data,
  children,
}: DataDisplayInterface<T>) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (data) {
    return children;
  }

  return <p>Loading...</p>;
};

export default DataDisplay;

