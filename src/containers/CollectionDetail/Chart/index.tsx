import LineChart from '@components/Chart/Line';
import SvgInset from '@components/SvgInset';
import Text from '@components/Text';
import { CDN_URL } from '@constants/config';
import { LogLevel } from '@enums/log-level';
import { TChartData } from '@interfaces/chart/data';
import { getSalesVolume } from '@services/shop';
import { formatBTCPrice, formatEthPrice } from '@utils/format';
import log from '@utils/logger';
import cs from 'classnames';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import s from './ActivityChart.module.scss';
import { Empty } from '@components/Collection/Empty';
import { Loading } from '@components/Loading';
import { GenerativeProjectDetailContext } from '@contexts/generative-project-detail-context';

enum chartFilters {
  SEVEN_DAY = 'week',
  ONE_MONTH = 'month',
}

const LOG_PREFIX = 'ActivityChart';

const ActivityChart = () => {
  const [filter, setFilter] = useState(chartFilters.ONE_MONTH);
  const [chartData, setChartData] = useState<TChartData>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { isTC } = useContext(GenerativeProjectDetailContext);
  const { projectID } = router.query as { projectID: string };

  const handleFetchChartData = async () => {
    if (projectID) {
      try {
        setIsLoading(true);
        const response = await getSalesVolume(
          { projectID },
          { dateRange: filter }
        );

        if (response) {
          const { volumns } = response;

          const labels = volumns.map(item =>
            dayjs(item.timestamp).format('M/DD')
          );
          const data = volumns.map(item => {
            if (isTC) {
              return formatEthPrice(item.amount);
            }
            return formatBTCPrice(item.amount);
          });

          setChartData({
            labels,
            datasets: [
              {
                label: '',
                data,
                fill: false,
                borderColor: '#4F43E2',
                tension: 0.1,
                borderWidth: 1,
              },
            ],
          });
          setIsLoading(false);
        }
      } catch (err: unknown) {
        log('failed to fetch chart data', LogLevel.ERROR, LOG_PREFIX);
        throw Error();
      }
    }
  };

  useEffect(() => {
    handleFetchChartData();
  }, [projectID, isTC, filter]);

  if (!projectID || !chartData) {
    return null;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.wrapper_header}>
        <div className={s.chart_options}>
          <div className={s.chart_options_item}>
            <SvgInset size={18} svgUrl={`${CDN_URL}/icons/ic-chart-line.svg`} />
            <Text size="18" fontWeight="medium">
              Volume
            </Text>
          </div>
        </div>
        <div className={s.chart_filters}>
          <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.SEVEN_DAY,
            })}
            onClick={() => setFilter(chartFilters.SEVEN_DAY)}
          >
            <Text size="14" fontWeight="medium">
              7D
            </Text>
          </div>
          <div
            className={cs(s.chart_filters_item, {
              [`${s.active}`]: filter === chartFilters.ONE_MONTH,
            })}
            onClick={() => setFilter(chartFilters.ONE_MONTH)}
          >
            <Text size="14" fontWeight="medium">
              30D
            </Text>
          </div>
        </div>
      </div>
      <div className={`${s.wrapper_chart} ${isLoading ? s.loading : ''}`}>
        {isLoading && <Loading isLoaded={!isLoading} />}
        {chartData && chartData.datasets[0].data.length === 0 ? (
          <Empty content="No Data Available." />
        ) : (
          <LineChart chartData={chartData} />
        )}
      </div>
    </div>
  );
};

export default ActivityChart;
