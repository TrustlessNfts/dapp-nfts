import Accordion from '@/components/Accordion';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { ARTIFACT_CONTRACT, BNS_CONTRACT, CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { IInscription } from '@/interfaces/api/inscription';
import { getNFTDetail } from '@/services/nft-explorer';
import { formatTimeStamp } from '@/utils/time';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, StyledDetailList } from './TokenDetail.styled';
import ActivityList from './ActivityList';
import OfferList from './OfferList';
import CTAButtons from './CTAButtons';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { shortenAddress } from '@/utils';
import IconSVG from '@/components/IconSVG';
import { onClickCopy } from '@/utils/commons';
import Link from 'next/link';
import logger from '@/services/logger';

const Inscription = () => {
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const userTcWallet = user?.walletAddress;
  const { contract, tokenId } = router.query as {
    contract: string;
    tokenId: string;
  };
  const [inscription, setInscription] = useState<IInscription | undefined>();
  const isOwner = useMemo(
    () => userTcWallet?.toLowerCase() === inscription?.owner?.toLowerCase(),
    [inscription?.owner, userTcWallet],
  );
  const isBNS = useMemo(
    () =>
      inscription?.collectionAddress.toLocaleLowerCase() ===
      BNS_CONTRACT.toLocaleLowerCase(),
    [inscription],
  );

  const fetchInscriptionDetail = useCallback(async () => {
    if (!contract || !tokenId) return;

    try {
      const data = await getNFTDetail({
        contractAddress: contract,
        tokenId: tokenId,
      });
      setInscription(data);
    } catch (error) {
      logger.error(error);
      router.push(ROUTE_PATH.NOT_FOUND);
    }
  }, [contract, tokenId, setInscription, router]);

  useEffect(() => {
    fetchInscriptionDetail();
  }, [fetchInscriptionDetail]);

  const renderDetailsList = useMemo(() => {
    if (!inscription) return <></>;

    const { owner, collectionAddress, contentType, mintedAt } = inscription;

    return (
      <StyledDetailList>
        <div className="list-item">
          <span>Owner</span>
          <div>
            <Link
              href={`https://explorer.trustless.computer/address/${owner}`}
              target="_blank"
            >
              {isOwner ? 'You' : shortenAddress(owner)}
            </Link>
            <IconSVG
              onClick={() => onClickCopy(owner)}
              src={`${CDN_URL}/icons/ic-copy.svg`}
              color="white"
              maxWidth="16"
              className="icon-copy"
            ></IconSVG>
          </div>
        </div>
        <div className="list-item">
          <span>Contract</span>
          <Link
            href={`https://explorer.trustless.computer/address/${collectionAddress}`}
            target="_blank"
          >
            {shortenAddress(collectionAddress)}
          </Link>
        </div>
        <div className="list-item">
          <span>Content type</span>
          <span>{contentType}</span>
        </div>
        {!!inscription?.mintedAt && (
          <div className="list-item">
            <span>Timestamp</span>
            <span>{formatTimeStamp(mintedAt * 1000)}</span>
          </div>
        )}
      </StyledDetailList>
    );
  }, [inscription, isOwner]);

  const renderAttributeList = useMemo(() => {
    const attributesList = inscription?.attributes?.sort((a, b) =>
      a.traitType.localeCompare(b.traitType),
    );

    return (
      <div className="properties-wrapper">
        {attributesList &&
          attributesList.length > 0 &&
          attributesList.map((trait, index) => (
            <div key={index.toString()} className="properties-item">
              <p className="properties-trait-type">{trait.traitType}</p>
              <p className="properties-trait-value">{trait.value}</p>
            </div>
          ))}
      </div>
    );
  }, [inscription]);

  const collectionName = useMemo(
    () => `${inscription?.collection?.name} #${inscription?.tokenId}`,
    [inscription?.collection?.name, inscription?.tokenId],
  );

  if (!inscription) {
    return <></>;
  }

  return (
    <>
      <Container>
        <div className="content">
          <div className="left-container">
            {inscription && !isBNS && (
              <NFTDisplayBox 
                className='thumbnail-wrapper'
                collectionID={inscription?.collectionAddress}
                contentClass="thumbnail"
                src={inscription.image}
                tokenID={inscription?.tokenId}
                type={inscription?.contentType}
              />
            )}
            {inscription && isBNS && (
              <div className="bns-wrapper">{inscription.name || 'Sudos'}</div>
            )}
          </div>
          <div className="right-container">
            <div className="header">
              <Link href={`${ROUTE_PATH.COLLECTION}/${contract}`} className="collection-index">
                {`Collection #${inscription.collection.index}`}
              </Link>
              <Link href={`${ROUTE_PATH.COLLECTION}/${contract}`} className="title">
                {contract.toLocaleLowerCase() ===
                  ARTIFACT_CONTRACT.toLocaleLowerCase()
                  ? `Artifact #${inscription?.tokenId}`
                  : collectionName}
              </Link>
              {inscription?.collection?.creator && (
                <p className="creator">
                  Owned by <span>{shortenAddress(inscription?.collection?.creator)}</span>
                </p>
              )}
              {inscription?.name !== collectionName && (
                <div className="token-name">
                  <p>{inscription?.name}</p>
                </div>
              )}
              <CTAButtons isOwner={isOwner} inscription={inscription} />
            </div>

            {inscription?.makeOffers && inscription?.makeOffers.length > 0 && (
              <Accordion header="Offers">
                <OfferList offers={inscription.makeOffers} isOwner={isOwner} />
              </Accordion>
            )}
            {inscription?.attributes && inscription?.attributes.length > 0 && (
              <Accordion header="Attributes">{renderAttributeList}</Accordion>
            )}
            <Accordion header="Artifact Details">{renderDetailsList}</Accordion>
            {inscription?.activities && inscription?.activities.length > 0 && (
              <Accordion header="Activities">
                <ActivityList activities={inscription.activities} />
              </Accordion>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default React.memo(Inscription);
