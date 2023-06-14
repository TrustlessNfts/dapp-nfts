import Button from '@/components/Button';
import { StyledCTAButtons } from './CTAButtons.styled';
import { useMemo, useState } from 'react';
import ModalListTokenForSale from '@/components/Transactor/ModalListTokenForSale';
import { IInscription } from '@/interfaces/api/inscription';
import ModalMakeOffer from '@/components/Transactor/ModalMakeOffer';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
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

  const showBuyButton =
    inscription?.listingForSales &&
    inscription?.listingForSales?.length > 0 &&
    !isOwner;

  const listingInfo = inscription?.listingForSales?.[0];

  const bestOffer = useMemo(() => {
    if (!inscription?.makeOffers || inscription?.makeOffers.length === 0) {
      return null;
    }

    return inscription?.makeOffers?.sort((a, b) => a.price - b.price)[0];
  }, [inscription]);

  if (!inscription) {
    return <></>;
  }

  return (
    <>
      <StyledCTAButtons>
        {showBuyButton && listingInfo && (
          <div className='current-price-wrapper'>
            <p className='current-price-label'>Current price</p>
            <p className='current-price-value'>{formatEthPrice(listingInfo?.price)}{' '}<img className='token-icon' src={mappingERC20ToIcon(listingInfo?.erc20Token)} alt='icon' /></p>
          </div>
        )}
        {!showBuyButton && (
          <div className='current-price-wrapper'>
            <p className='current-price-label'>Best offer</p>
            {bestOffer ? (
              <p className='current-price-value'>{formatEthPrice(bestOffer?.price)}{' '}<img className='token-icon' src={mappingERC20ToIcon(bestOffer?.erc20Token)} alt='icon' /></p>
            ) : (
              <p className='current-price-value'>-</p>
            )}
          </div>
        )}
        <div className='action-wrapper'>
          {showBuyButton && listingInfo && (
            <Button
              background={'white'}
              bg="white"
              className="cta-btn buy-btn"
              onClick={() => setShowPurchase(true)}
            >
              Buy now
            </Button>
          )}
          {!isOwner && (
            <>
              <Button
                bg="white"
                className="cta-btn make-offer-btn"
                onClick={() => setShowMakeOffer(true)}
              >
                Make Offer
              </Button>
            </>
          )}
          {isOwner && !listingInfo && (
            <Button
              onClick={() => setShowListForSale(true)}
              background={'white'}
              bg="white"
              className="cta-btn make-offer-btn"
            >
              List for Sale
            </Button>
          )}
          {isOwner && listingInfo && (
            <Button
              onClick={() => setShowCancelListing(true)}
              background={'white'}
              bg="white"
              className="cta-btn make-offer-btn"
            >
              Cancel Listing
            </Button>
          )}
        </div>
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
