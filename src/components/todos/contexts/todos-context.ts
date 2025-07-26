import { createContext } from 'react';
import type { TodosContextType } from '../types/todos.types';

const TodosContext = createContext<TodosContextType | undefined>(undefined);
export default TodosContext;

