export interface Column<T> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ProtectedRouteProps {
  isAnonymousRequired?: boolean;
}

