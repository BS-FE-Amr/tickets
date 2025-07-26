import type { Column } from '../../../types/general.types';
import type { TodosData } from '../types/todos.types';

export function createData(
  id: string,
  todo: string,
  completed: string,
  userId: string,
): TodosData {
  return { id, todo, completed, userId };
}

export const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 170 },
  { id: 'todo', label: 'Todo', minWidth: 100 },
  {
    id: 'completed',
    label: 'Completed',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'userId',
    label: 'User ID',
    minWidth: 170,
    align: 'right',
  },
];

