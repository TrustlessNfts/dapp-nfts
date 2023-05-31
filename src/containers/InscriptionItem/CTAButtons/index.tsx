import Button from '@/components/Button';
import Text from '@/components/Text';
import { StyledCTAButtons } from './CTAButtons.styled';
import { TransactionEventType } from '@/enums/transaction';

type Props = {
  isOwner: boolean;
  setTransactionType: (type: TransactionEventType | null) => void;
  setShowModal: (show: boolean) => void;
};

const CTAButtons = ({ isOwner, setTransactionType, setShowModal }: Props) => {
  const handleShowModal = (type: TransactionEventType) => {
    setTransactionType(type);
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
            onClick={() => handleShowModal(TransactionEventType.BUY)}
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
            onClick={() => handleShowModal(TransactionEventType.OFFER)}
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
