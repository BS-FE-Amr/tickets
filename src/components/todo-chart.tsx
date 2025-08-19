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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, ChartDataLabels);

export default function PieChart({ data, isLoading, error, chartData, head }) {
  const options = {
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value: number, ctx: any) => {
          const total = ctx.chart.data.datasets[0].data.reduce(
            (acc: number, curr: number) => acc + curr,
            0,
          );
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          return percentage;
        },
      },
      legend: {
        position: 'top' as const,
      },
    },
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
      <Typography variant="h4">{head}</Typography>
      <div
        style={{
          height: 300,
          marginTop: 32,
        }}>
        <DataDisplay<TodosStatusResponse | undefined>
          data={data}
          error={error?.message}
          isLoading={isLoading}>
          <Pie data={chartData} options={options} />
        </DataDisplay>
      </div>
    </Box>
  );
}

