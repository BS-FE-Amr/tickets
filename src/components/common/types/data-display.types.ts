import type React from 'react';

export type IsLoadingType = boolean;
export type ErrorType = string | null;
export type ChildrenType = React.ReactNode;

export interface DataDisplayInterface<T> {
  isLoading: IsLoadingType;
  error: ErrorType;
  children: ChildrenType;
  data: T;
}

