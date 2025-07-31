import type { ChildrenType } from '../types/general.types';
import Loading from './loading';

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
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (data) {
    return children;
  }

  return <Loading />;
};

export default DataDisplay;

