import React from 'react';
import Table from '@/components/Table';
import { ICollection } from '@/interfaces/api/marketplace';
import { Wrapper } from './DataTable.styled';
import { shortenAddress } from '@/utils';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import ImageWrapper from '@/components/ImageWrapper';

interface IProps {
  collections: Array<ICollection>;
}

const DataTable: React.FC<IProps> = ({ collections }: IProps): React.ReactElement => {
  const router = useRouter();

  const onClickItem = (collectionContract: string) => {
    router.push(`${ROUTE_PATH.COLLECTION}/${collectionContract}`)
  }

  if (!collections) return <></>;

  const tableData = collections?.map((collection: ICollection) => {
    const { name, floorPrice, volume, totalItems, totalOwners, thumbnail, contract, id, creator } = collection;

    return {
      id: id,
      config: {
        onClick: () => onClickItem(contract)
      },
      render: {
        info: (
          <div className={'collection-info'}>
            <ImageWrapper className='collection-img' src={thumbnail} alt={name} />
            <div className="main-info">
              <p className='collection-name'>{name}</p>
              <p className='collection-owner'>{shortenAddress(creator)}</p>
            </div>
          </div>
        ),

        floorPrice: (
          <div className={'floor-price'}>
            {floorPrice > 0 ? floorPrice.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 6,
            }) : '-'}
          </div>
        ),

        volume: (
          <div className={'volume'}>
            {volume > 0 ? volume.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 6,
            }) : '-'}
          </div>
        ),

        owners: (
          <div className={'owners'}>
            {totalOwners.toLocaleString('en-US')}
            {totalItems > 0 ? ` (${(totalOwners / totalItems * 100).toFixed(0)}%)` : ''}
          </div>
        ),

        supply: (
          <div className={'supply'}>
            {totalItems.toLocaleString('en-US')}
          </div>
        ),
      },
    };
  });

  return (
    <Wrapper>
      <Table
        tableHead={['Name', 'Floor price', 'Total Sales', 'Owners', 'Supply']}
        data={tableData}
        className="data-table"
      />
    </Wrapper>
  )
}

export default React.memo(DataTable);
