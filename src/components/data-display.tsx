import { CircularProgress } from '@mui/material';
import type { ChildrenType } from '../types/general.types';

type IsLoadingType = boolean;
type ErrorType = string | null | undefined;

export interface DataDisplayInterface<T> {
  isLoading: IsLoadingType;
  error: ErrorType;
  children: ChildrenType;
  data: T;
}

const DataDisplay = <T,>({
  isLoading,
  error,
  data,
  children,
}: DataDisplayInterface<T>) => {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (data) {
    return children;
  }

  return <CircularProgress />;
};

export default DataDisplay;

