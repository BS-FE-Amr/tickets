import TodosTable from './todos-table';
import TodosFilterDropdown from './todos-filter-dropdown';
import TodosSearch from './todos-search';
import { TodosProvider } from '../contexts/todos-context-wrapper';

const Todos = () => {
  return (
    <TodosProvider>
      <div className="container mt-[24px]">
        <h2 className="font-black text-[24px]">Todos</h2>
        <div className="mt-[24px] ">
          <div className="flex gap-[24px] mb-[24px]">
            <TodosSearch />
            <TodosFilterDropdown />
          </div>
          <TodosTable />
        </div>
      </div>
    </TodosProvider>
  );
};

export default Todos;

