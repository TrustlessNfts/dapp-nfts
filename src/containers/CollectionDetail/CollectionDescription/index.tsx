import { ICollection } from '@/interfaces/api/marketplace';
import React, { } from 'react';
import { Wrapper } from './CollectionDescription.styled';
import ShowMoreText from '@/components/ShowMoreText';
import { formatTimeStamp } from '@/utils/time';
import { formatDateTime } from '@/utils/time';

interface IProps {
  collection: ICollection | null;
}

const CollectionDescription: React.FC<IProps> = ({ collection }: IProps): React.ReactElement => {
  const description = collection?.description || "";

  return (
    <Wrapper>
      {description && (
        <ShowMoreText showMoreClassname='showMoreBtn' maxLines={5}>
          <p className={'description'}>{description}</p>
        </ShowMoreText>
      )}

      <div className="general-info">
        {collection?.createdAt && (
          <div className="info-item">
            <span className='info-label'>Created date:</span><span className='info-value'>{formatDateTime({
              dateTime: collection.createdAt, 
              formatPattern: 'DD MMM YYYY HH:mm'
            })}</span>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

export default CollectionDescription;