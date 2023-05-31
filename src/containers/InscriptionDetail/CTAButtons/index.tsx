import Button from '@/components/Button';
import Text from '@/components/Text';
import { StyledCTAButtons } from './CTAButtons.styled';
import { useState } from 'react';
import ModalListTokenForSale from '@/components/Transactor/ModalListTokenForSale';
import { IInscription } from '@/interfaces/api/inscription';
import ModalMakeOffer from '@/components/Transactor/ModalMakeOffer';

type Props = {
  isOwner: boolean;
  inscription?: IInscription;
};

const CTAButtons = ({ isOwner, inscription }: Props) => {
  const [showPurchase, setShowPurchase] = useState(false);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showListForSale, setShowListForSale] = useState(false);

  if (!inscription) {
    return <></>;
  }

  return (
    <>
      <StyledCTAButtons>
        {!isOwner && (
          <>
            <Button
              background={'white'}
              bg="white"
              className="cta-btn"
              onClick={() => setShowPurchase(true)}
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
              onClick={() => setShowMakeOffer(true)}
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
          <Button
            onClick={() => setShowListForSale(true)}
            background={'white'}
            bg="white"
            className="cta-btn"
          >
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

      <ModalListTokenForSale
        show={showListForSale}
        handleClose={() => setShowListForSale(false)}
        inscription={inscription}
      />
      <ModalMakeOffer
        show={showMakeOffer}
        handleClose={() => setShowMakeOffer(false)}
        inscription={inscription}
      />
    </>
  );
};

export default CTAButtons;
