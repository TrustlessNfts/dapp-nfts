import React, { useRef } from 'react';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title, ChartOptions, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { IChartData } from '@/interfaces/chart';
import dayjs from 'dayjs';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

interface IProps {
  chartData: IChartData;
};

const LineChart: React.FC<IProps> = ({ chartData }: IProps) => {
  const ref = useRef();

  const chartOptions: ChartOptions<'line'> = {
    scales: {
      x: {
        title: {
          display: false,
          text: 'Time',
        },
        grid: {
          display: false
        },
        ticks: {
          color: '#fff',
        },
        border: {
          color: "#333"
        }
      },
      y: {
        title: {
          display: false,
          text: 'Sales',
        },
        ticks: {
          count: 5,
          mirror: true,
          color: '#fff',
        },
        grid: {
          color: "#333"
        },
        border: {
          color: "#333"
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#333',
        bodyColor: '#fff',
        titleColor: '#fff',
        cornerRadius: 2,
        displayColors: false,
        borderColor: '#0000001a',
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const date = new Date(context.label);
            return dayjs(date).format('DD MMM YYYY');
          },
          title(tooltipItems) {
            return `${tooltipItems[0].formattedValue} ${'BTC'}`;
          },
        },
      },
    },
    elements: {
      point: {
        backgroundColor: '#4F43E2',
        borderColor: '#4F43E2',
      },
    },
  };

  return (
    <div>
      <Line ref={ref} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
