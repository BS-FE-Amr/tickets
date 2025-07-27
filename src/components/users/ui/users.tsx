import UsersTable from './users-table';
import UsersFilterDropdown from './users-filter-dropdown';
import UsersSearch from './users-search';
import { UsersProvider } from '../contexts/users-context-wrapper';

const Users = () => {
  return (
    <UsersProvider>
      <div className="container mt-[24px]">
        <h2 className="font-black text-[24px]">Users</h2>
        <div className="mt-[24px] ">
          <div className="flex gap-[24px] mb-[24px]">
            <UsersSearch />
            <UsersFilterDropdown />
          </div>
          <UsersTable />
        </div>
      </div>
    </UsersProvider>
  );
};

export default Users;

