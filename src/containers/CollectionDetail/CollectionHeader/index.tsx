import React, {  } from 'react';
import { Wrapper } from './CollectionHeader.styled';
import ImageWrapper from '@/components/ImageWrapper';
import { ICollection } from '@/interfaces/api/marketplace';

interface IProps {
  collection: ICollection | null;
}

const CollectionHeader: React.FC<IProps> = ({collection}: IProps): React.ReactElement => {
  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <div className="left-content">
        <div className="thumbnail-wrapper">
          <ImageWrapper className='collection-thumbnail' src={collection.thumbnail} alt={collection.name} />
        </div>
        <div className="collection-info">
          <h1 className='collection-name'>{collection.name}</h1>
          <p className='collection-index'>{`Collection #${collection.index}`}</p>
        </div>
      </div>
      <div className="right-content">
        {!!collection.totalItems && (
          <div className="trading-info-item">
            <p className="info-label">
              Items
            </p>
            <p className="info-value">
              {collection.totalItems}
            </p>
          </div>
        )}
        {!!collection.totalSales && (
          <div className="trading-info-item">
            <p className="info-label">
              Listed
            </p>
            <p className="info-value">
              {collection.totalSales}
            </p>
          </div>
        )}
        {!!collection.floorPrice && (
          <div className="trading-info-item">
            <p className="info-label">
              Floor price
            </p>
            <p className="info-value">
              {collection.floorPrice.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 6,
              })}
            </p>
          </div>
        )}
        {!!collection.volume && (
          <div className="trading-info-item">
            <p className="info-label">
              Total volume
            </p>
            <p className="info-value">
              {collection.volume.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 6,
              })}
            </p>
          </div>
        )}
      </div>
    </Wrapper>
  )
};

export default React.memo(CollectionHeader);
