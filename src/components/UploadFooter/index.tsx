import Text from '@/components/Text';
import { StyledUploadFooter } from './UploadFooter.styled';

import Button from '../Button';

type Props = {
  handleOpenModal: () => void;
  isUploadVisible: boolean;
  style?: React.CSSProperties;
};

const UploadFooter = ({
  handleOpenModal,
  // onSizeError,
  isUploadVisible,
  style,
}: Props) => {
  return (
    <StyledUploadFooter isUploadVisible={isUploadVisible} style={style}>
      <div className="text">
        <span>Are you a creator? Create you first ever BRC-721 collection now</span>
      </div>
      <div className="button">
        <Button
          className="create-btn"
          background={'linear-gradient(90deg, #9796f0,#fbc7d4)'}
          onClick={handleOpenModal}
        >
          <Text className="button-text" color="bg1" fontWeight="medium">
            Create BRC-721
          </Text>
        </Button>
      </div>
    </StyledUploadFooter>
  );
};

export default UploadFooter;
