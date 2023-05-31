import Button from '@/components/Button';
import Text from '@/components/Text';
import { StyledCTAButtons } from './CTAButtons.styled';

type Props = {
  isOwner: boolean;
  setShowModal: (show: boolean) => void;
};

const CTAButtons = ({ isOwner, setShowModal }: Props) => {
  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <StyledCTAButtons>
      {!isOwner && (
        <>
          <Button
            background={'white'}
            bg="white"
            className="cta-btn"
            onClick={() => handleShowModal()}
          >
            <Text
              size="medium"
              color="bg1"
              className="button-text"
              fontWeight="medium"
            >
              Buy 0 TC
            </Text>
          </Button>
          <Button
            background={'white'}
            bg="white"
            className="cta-btn"
            onClick={() => handleShowModal()}
          >
            <Text
              size="medium"
              color="bg1"
              className="button-text"
              fontWeight="medium"
            >
              Make Offer
            </Text>
          </Button>
        </>
      )}
      {isOwner && (
        <Button background={'white'} bg="white" className="cta-btn">
          <Text
            size="medium"
            color="bg1"
            className="button-text"
            fontWeight="medium"
          >
            List for Sale
          </Text>
        </Button>
      )}
    </StyledCTAButtons>
  );
};

export default CTAButtons;
