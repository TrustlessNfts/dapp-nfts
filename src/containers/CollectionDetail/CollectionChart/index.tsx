import LineChart from '@/components/Chart/LineChart';
import { IChartData } from '@/interfaces/chart';
import { formatEthPrice } from '@/utils/format';
import cs from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import Empty from '@/components/Empty';
import { ChartFilter, ICollection } from '@/interfaces/api/marketplace';
import { Wrapper } from './CollectionChart.styled';
import { Spinner } from 'react-bootstrap';
import logger from '@/services/logger';
import { getCollectionChart } from '@/services/marketplace';

interface IProps {
  collection: ICollection | null;
}

const CollectionChart: React.FC<IProps> = ({ collection }: IProps): React.ReactElement => {
  const [range, setRange] = useState(ChartFilter.ONE_MONTH);
  const [chartData, setChartData] = useState<IChartData>({
    labels: [],
    datasets: []
  });
  const [isLoading, setLoading] = useState(false);

  const handleFetchChartData = async () => {
    if (!collection) return;
    try {
      setLoading(true);
      const res = await getCollectionChart({
        contract_address: collection.contract,
        date_range: range,
      });
      console.log(res);

      if (res && Array.isArray(res)) {
        const labels = res.map(item =>
          dayjs(item.volumeCreatedAtDate).format('DD MMM')
        );
        const data = res.map(item => {
          return formatEthPrice(item.btc);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: '',
              data,
              fill: false,
              borderColor: '#fff',
              tension: 0.1,
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchChartData();
  }, [collection, range]);

  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <div className='section-header'>
        <h3 className='section-title'>
          Floor price
        </h3>
        <div className='chart-filter-wrapper'>
          <button
            className={cs('chart-filter-item', {
              active: range === ChartFilter.SEVEN_DAY,
            })}
            onClick={() => setRange(ChartFilter.SEVEN_DAY)}
          >
            7D
          </button>
          <button
            className={cs('chart-filter-item', {
              active: range === ChartFilter.ONE_MONTH,
            })}
            onClick={() => setRange(ChartFilter.ONE_MONTH)}
          >
            30D
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="loading-wrapper">
          <Spinner variant='light' />
        </div>
      )}
      {!isLoading && (
        <>
          {chartData && (chartData.datasets.length === 0 || (chartData.datasets.length > 0 && chartData.datasets[0].data.length === 0)) ? (
            <div className="loading-wrapper">
              <Empty />
            </div>
          ) : (
            <div className={`chart-wrapper`}>
              <LineChart chartData={chartData} />
            </div>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default CollectionChart;
