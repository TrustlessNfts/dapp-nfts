export interface IChartDataSet {
  label?: string;
  data: Array<string | number>;
  fill: boolean;
  borderColor: string;
  tension: number;
  borderWidth: number;
}

export interface IChartData {
  labels: string[];
  datasets: Array<IChartDataSet>;
};
