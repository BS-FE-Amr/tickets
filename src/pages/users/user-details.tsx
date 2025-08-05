// import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import DataDisplay from '../../components/data-display';
import { Box, Paper, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { FETCH_USER } from '../../services/users-service-gql';
import type { UserItemResponse } from '../../types/users-gql.types';

const UserDetails = ({ userId }: { userId?: string }) => {
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

  return (
    <DataDisplay<UserItemResponse | undefined>
      data={data}
      error={error?.message}
      isLoading={isLoading}>
      <div className="mt-[24px]">
        <div className="container">
          <Box sx={{ p: 4, maxWidth: 500, margin: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <div className="flex justify-between items-center">
                <Typography variant="h5" fontWeight="bold">
                  User
                </Typography>
                {/* <Link href={`/users/${userFinalId}/edit`}>Edit</Link> */}
              </div>
              <div className="mt-[24px]">
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Id:</Typography>
                  <Typography variant="body1">
                    {data?.employee.documentId}
                  </Typography>
                </div>

                <div className="flex gap-[16px] ">
                  <Typography variant="body1">First Name:</Typography>
                  <Typography variant="body1">
                    {data?.employee.firstName}
                  </Typography>
                </div>
                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Last Name:</Typography>
                  <Typography variant="body1">
                    {data?.employee.lastName}
                  </Typography>
                </div>

                <div className="flex gap-[16px] ">
                  <Typography variant="body1">Age:</Typography>
                  <Typography variant="body1">{data?.employee.age}</Typography>
                </div>
              </div>
            </Paper>
          </Box>
        </div>
      </div>
    </DataDisplay>
  );
};

export default UserDetails;

