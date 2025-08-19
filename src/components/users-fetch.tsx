import * as React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  TablePagination,
  CircularProgress,
  TextField,
  Box,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { FETCH_USERS } from '../services/users-service-gql';

interface EmployeesResponse {
  employees_connection: {
    nodes: { id: string; employee: string }[];
    pageInfo: { total: number };
  };
}

interface FetchPaginatedFilteredSearch {
  page: number;
  pageSize: number;
  filters: any;
}

export default function DropdownWithPagination({
  defaultItem,
  isEditing,
  value,
  setValue,
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<any>(defaultItem);

  const [search, setSearch] = React.useState(''); // raw input
  const [debouncedSearch, setDebouncedSearch] = React.useState(''); // debounced value
  const rowsPerPage = 5;

  const { data, loading, error } = useQuery<
    EmployeesResponse,
    FetchPaginatedFilteredSearch
  >(FETCH_USERS, {
    variables: {
      page: page + 1,
      pageSize: rowsPerPage,
      filters: debouncedSearch
        ? {
            and: [
              { firstName: { contains: debouncedSearch.split(' ')[0] || '' } },
              { lastName: { contains: debouncedSearch.split(' ')[1] || '' } },
            ],
          }
        : {},
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (employee?: any) => {
    setAnchorEl(null);
    if (employee) setSelected(employee);
    if (setValue) {
      setValue(employee);
    }
  };

  // 🔹 Debounce search input
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0); // reset to first page
      setDebouncedSearch(search);
    }, 500); // debounce delay (ms)

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  React.useEffect(() => {
    setSelected(defaultItem);
  }, [isEditing]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClick} disabled={!isEditing}>
        {!isEditing && defaultItem
          ? `${defaultItem.firstName} ${defaultItem.lastName}`
          : selected
          ? `${selected.firstName} ${selected.lastName}`
          : 'Select Employee'}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        PaperProps={{ style: { width: 300, overflowX: 'auto' } }}>
        {/* 🔍 Search field inside dropdown */}
        <Box p={1}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            onKeyDown={(e) => e.stopPropagation()}
          />
        </Box>

        {loading ? (
          <MenuItem>
            <CircularProgress size={20} />
          </MenuItem>
        ) : error ? (
          <MenuItem>Error loading employees</MenuItem>
        ) : data?.employees_connection?.nodes?.length ? (
          data.employees_connection.nodes.map((employee) => (
            <MenuItem
              key={employee.id}
              onClick={() => handleClose(employee)}
              sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <p>
                {employee.firstName} {employee.lastName}
              </p>
              <p>({employee.documentId})</p>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No results</MenuItem>
        )}

        <TablePagination
          component="div"
          count={data?.employees_connection?.pageInfo?.total ?? 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </Menu>
    </div>
  );
}

