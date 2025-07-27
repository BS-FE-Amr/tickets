import type { UsersContextType } from '../types/users.types';
import { createContext } from 'react';

const UserContext = createContext<UsersContextType | undefined>(undefined);
export default UserContext;

