import type { Column } from '../../../types/general.types';
import type { UsersData } from '../types/users.types';

export function createData(
  id: number,
  firstName: string,
  lastName: string,
  age: number,
): UsersData {
  return { id, firstName, lastName, age };
}

export const columns: readonly Column<UsersData>[] = [
  { id: 'id', label: 'Id', minWidth: 170 },
  { id: 'firstName', label: 'First Name', minWidth: 100 },
  {
    id: 'lastName',
    label: 'LastName',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'age',
    label: 'Age',
    minWidth: 170,
    align: 'right',
  },
];

