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
        ? `/employees?filters[${filterValue}][$contains]=${searchValue}&pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`
        : `/employees?pagination[page]=${page}&pagination[pageSize]=${rowsPerPage}`,
    )
    .then((res) => res.data);
};

export const fetchMyData = () => {
  return api
    .get('/users/me', {
      // headers: {
      //   Authorization: `Bearer ${
      //     localStorage.getItem('access_token') ||
      //     sessionStorage.getItem('access_token')
      //   }`,
      // },
    })
    .then((res) => res.data);
};

