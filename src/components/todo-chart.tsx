import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  type ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';
import DataDisplay from './data-display';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, ChartDataLabels);

interface PieChartProps<T> {
  data?: T;
  isLoading: boolean;
  error?: Error | null;
  head: string;
  chartData: ChartData<'pie', number[], string>; // Pie chart with number[] data
}

export default function PieChart<T>({
  data,
  isLoading,
  error,
  chartData,
  head,
}: PieChartProps<T>) {
  const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

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
          return percentage; // show percentage INSIDE chart
        },
      },
      legend: {
        position: 'top' as const,
        labels: {
          generateLabels: (chart: any) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce(
              (acc: number, curr: number) => acc + curr,
              0,
            );

            return chart.data.labels.map((label: string, i: number) => {
              const value = dataset.data[i];
              const percentage = ((value / total) * 100).toFixed(1) + '%';

              return {
                text: `${label}: ${value} (${percentage})`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle:
                  dataset.borderColor?.[i] ?? dataset.backgroundColor[i],
                lineWidth: 1,
                hidden: isNaN(value) || value === null,
                index: i,
              };
            });
          },
        },
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
      <div
        style={{
          height: 300,
          marginTop: 32,
        }}>
        <DataDisplay<T | undefined>
          data={data}
          error={error?.message}
          isLoading={isLoading}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 3, textAlign: 'center', width: 320 }}>
            <Typography variant="h6" gutterBottom>
              {head}
            </Typography>
            <Box sx={{ width: 250, mx: 'auto' }}>
              <Pie data={chartData} options={options} />
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {chartData.datasets[0].data[0]}/{total} {chartData.labels?.[0]}
            </Typography>
            <Typography variant="body2">
              {chartData.datasets[0].data[1]}/{total} {chartData.labels?.[1]}
            </Typography>
          </Paper>
        </DataDisplay>
      </div>
    </Box>
  );
}

