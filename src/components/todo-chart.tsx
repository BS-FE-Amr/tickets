import { useQuery } from '@apollo/client';
import { GET_TODO_STATS } from '../services/todos-service-gql';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import DataDisplay from './data-display';
import type { TodosStatusResponse } from '../types/todos-gql.types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

export default function TodoChart() {
  const {
    data,
    loading: isLoading,
    error,
  } = useQuery<TodosStatusResponse>(GET_TODO_STATS);

  const chartData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Todos',
        data: [data?.todoStats.completed, data?.todoStats.notCompleted || 0],
        backgroundColor: ['#0f7037', '#910929'],
      },
    ],
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'column',
        mb: 6,
      }}>
      <Typography variant="h4">Todos Percentages</Typography>
      <div
        style={{
          height: 300,
          marginTop: 32,
        }}>
        <DataDisplay<TodosStatusResponse | undefined>
          data={data}
          error={error?.message}
          isLoading={isLoading}>
          <Pie data={chartData} />
        </DataDisplay>
      </div>
    </Box>
  );
}

