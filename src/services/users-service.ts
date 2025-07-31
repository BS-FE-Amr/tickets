import api from '../utils/api';

export const fetchUsers = (
  searchValue: string,
  filterValue: string,
  rowsPerPage: number,
  page: number,
) => {
  return api
    .get(
      filterValue && searchValue
        ? `/auth/users/filter?limit=${rowsPerPage}&skip=${
            rowsPerPage * page
          }&key=${filterValue}&value=${searchValue}`
        : `/auth/users?limit=${rowsPerPage}&skip=${rowsPerPage * page}`,
    )
    .then((res) => res.data);
};

export const fetchMyData = () => {
  return api.get('/auth/user/me').then((res) => res.data);
};
