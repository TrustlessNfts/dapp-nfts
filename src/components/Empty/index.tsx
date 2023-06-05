import { StyledEmpty } from './Empty.styled';
import { CDN_URL } from '@/configs';

export type TEmpty = {
  infoText?: string;
  isTable?: boolean;
};

const Empty = ({ infoText = 'No data', isTable = false }: TEmpty) => {
  return (
    <StyledEmpty className={'notFound'} isTable={isTable}>
      <img
        width={95}
        height={95}
        src={`${CDN_URL}/icons/empty-white.svg`}
        alt="Not found item"
        className={'image'}
      />
      <p className="nodata-text">{infoText}</p>
    </StyledEmpty>
  );
};

export default Empty;
