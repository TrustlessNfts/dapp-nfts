import ImageWrapper from '@/components/ImageWrapper';
import Table from '@/components/Table';
import { ROUTE_PATH } from '@/constants/route-path';
import { ICollection } from '@/interfaces/api/marketplace';
import { useRouter } from 'next/router';
import React from 'react';
import { Wrapper } from './DataTable.styled';

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
      floorPrice,
      volume,
      totalItems,
      totalOwners,
      thumbnail,
      contract,
      id,
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
            {floorPrice > 0
              ? floorPrice.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 6,
                })
              : '-'}
          </div>
        ),

        volume: (
          <div className={'volume'}>
            {volume > 0
              ? volume.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 6,
                })
              : '-'}
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
