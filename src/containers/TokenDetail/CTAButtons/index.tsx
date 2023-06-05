import Button from '@/components/Button';
import Text from '@/components/Text';
import { StyledCTAButtons } from './CTAButtons.styled';
import { useState } from 'react';
import ModalListTokenForSale from '@/components/Transactor/ModalListTokenForSale';
import { IInscription } from '@/interfaces/api/inscription';
import ModalMakeOffer from '@/components/Transactor/ModalMakeOffer';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import ModalCancelListing from '@/components/Transactor/ModalCancelListing';
import ModalPurchase from '@/components/Transactor/ModalPurchase';

type Props = {
  isOwner: boolean;
  inscription?: IInscription;
};

const CTAButtons = ({ isOwner, inscription }: Props) => {
  const [showPurchase, setShowPurchase] = useState(false);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showListForSale, setShowListForSale] = useState(false);
  const [showCancelListing, setShowCancelListing] = useState(false);

  if (!inscription) {
    return <></>;
  }
  const showBuyButton =
    inscription?.listingForSales &&
    inscription?.listingForSales?.length > 0 &&
    !isOwner;

  const listingInfo = inscription?.listingForSales?.[0];

  return (
    <>
      <StyledCTAButtons>
        {showBuyButton && listingInfo && (
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
              Buy {formatEthPrice(listingInfo?.price)}{' '}
              {mappingERC20ToSymbol(listingInfo?.erc20Token)}
            </Text>
          </Button>
        )}
        {!isOwner && (
          <>
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
        {isOwner && !listingInfo && (
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
        {isOwner && listingInfo && (
          <Button
            onClick={() => setShowCancelListing(true)}
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
              Cancel Listing
            </Text>
          </Button>
        )}
      </StyledCTAButtons>

      <ModalListTokenForSale
        show={showListForSale}
        handleClose={() => setShowListForSale(false)}
        inscription={inscription}
      />
      <ModalCancelListing
        show={showCancelListing}
        handleClose={() => setShowCancelListing(false)}
        inscription={inscription}
      />
      <ModalMakeOffer
        show={showMakeOffer}
        handleClose={() => setShowMakeOffer(false)}
        inscription={inscription}
      />
      <ModalPurchase
        show={showPurchase}
        handleClose={() => setShowPurchase(false)}
        inscription={inscription}
      />
    </>
  );
};

export default CTAButtons;