import ImageWrapper from '@/components/ImageWrapper';
import Table from '@/components/Table';
import { ROUTE_PATH } from '@/constants/route-path';
import { ICollection } from '@/interfaces/api/marketplace';
import { useRouter } from 'next/router';
import React from 'react';
import { Wrapper } from './DataTable.styled';
import { CDN_URL } from '@/configs';
import { ceilPrecised } from '@/utils/format';

interface IProps {
  collections: Array<ICollection>;
}

const DataTable: React.FC<IProps> = ({
  collections,
}: IProps): React.ReactElement => {
  const router = useRouter();

  const onClickItem = (collectionContract: string) => {
    router.push(`${ROUTE_PATH.COLLECTION}/${collectionContract}`);
  };

  if (!collections) return <></>;

  const tableData = collections?.map((collection: ICollection) => {
    const {
      name,
      totalItems,
      totalOwners,
      thumbnail,
      contract,
      id,
      btcVolume,
      btcFloorPrice,
    } = collection;

    return {
      id: id,
      config: {
        onClick: () => onClickItem(contract),
      },
      render: {
        info: (
          <div className={'collection-info'}>
            <ImageWrapper className="collection-img" src={thumbnail} alt={name} />
            <div className="main-info">
              <p className="collection-name">{name}</p>
              <p className="collection-index">{`Collection #${collection.index}`}</p>

              {/* <p className="collection-owner">{shortenAddress(creator)}</p> */}
            </div>
          </div>
        ),

        floorPrice: (
          <div className={'floor-price'}>
            {btcFloorPrice > 0 ? (
              <span>
                {ceilPrecised(btcFloorPrice)}{' '}
                <img
                  className="token-icon"
                  src={`${CDN_URL}/icons/ic-btc-24.svg`}
                  alt="token icon"
                />
              </span>
            ) : (
              '-'
            )}
          </div>
        ),

        volume: (
          <div className={'volume'}>
            {btcVolume > 0 ? (
              <span>
                {ceilPrecised(btcVolume)}{' '}
                <img
                  className="token-icon"
                  src={`${CDN_URL}/icons/ic-btc-24.svg`}
                  alt="token icon"
                />
              </span>
            ) : (
              '-'
            )}
          </div>
        ),

        owners: (
          <div className={'owners'}>
            {totalOwners.toLocaleString('en-US')}
            {totalItems > 0
              ? ` (${((totalOwners / totalItems) * 100).toFixed(0)}%)`
              : ''}
          </div>
        ),

        supply: <div className={'supply'}>{totalItems.toLocaleString('en-US')}</div>,
      },
    };
  });

  return (
    <Wrapper>
      <Table
        tableHead={['Name', 'Floor Price', 'Total Volume', 'Owners', 'Supply']}
        data={tableData}
        className="data-table"
      />
    </Wrapper>
  );
};

export default React.memo(DataTable);
