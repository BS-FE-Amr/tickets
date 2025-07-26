export interface Column {
  id: 'id' | 'todo' | 'completed' | 'userId';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ProtectedRouteProps {
  isAnonymousRequired?: boolean;
}

