// import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import DataDisplay from '../../components/data-display';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { FETCH_USER } from '../../services/users-service-gql';
import type { UserItemResponse } from '../../types/users-gql.types';

const UserDetails = ({
  userId,
  handleClose,
}: {
  userId?: string;
  handleClose: () => void;
}) => {
  const { id } = useParams();
  const userFinalId = userId || id;

  // const { data, error, isLoading } = useQuery<UserItemResponse>({
  //   queryKey: ['users', id],
  //   queryFn: () => fetchUser(String(id)),
  // });

  const {
    data,
    error,
    loading: isLoading,
  } = useQuery<UserItemResponse>(FETCH_USER, {
    variables: {
      documentId: userFinalId,
    },
  });

  if (!userFinalId) {
    return;
  }

  return (
    <>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        <DataDisplay<UserItemResponse | undefined>
          data={data}
          error={error && error?.message}
          isLoading={isLoading}>
          <Typography>
            <strong>ID:</strong> {data?.employee.documentId}
          </Typography>
          <Typography>
            <strong>First Name:</strong> {data?.employee.firstName}
          </Typography>
          <Typography>
            <strong>Last Name:</strong> {data?.employee.lastName}
          </Typography>
          <Typography>
            <strong>Age:</strong> {data?.employee.age}
          </Typography>
        </DataDisplay>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </>
  );
};

export default UserDetails;

