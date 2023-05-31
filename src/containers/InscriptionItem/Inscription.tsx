/* eslint-disable jsx-a11y/anchor-is-valid */
import Accordion from '@/components/Accordion';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { ARTIFACT_CONTRACT, CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { IInscription } from '@/interfaces/api/inscription';
import { getNFTDetail } from '@/services/nft-explorer';
import { formatTimeStamp } from '@/utils/time';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { Container, StyledDetailList } from './Inscription.styled';
import ActivityList from './ActivityList';
import OfferList from './OfferList';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import IconSVG from '@/components/IconSVG';
import { shortenAddress } from '@/utils';
import { onClickCopy } from '@/utils/commons';
import Link from 'next/link';

const Inscription = () => {
  const router = useRouter();
  const { tcAddress: userTcWallet } = useSelector(getUserSelector);
  const { contract, id } = queryString.parse(location.search) as {
    contract: string;
    id: string;
  };
  const [inscription, setInscription] = useState<IInscription | undefined>();

  const fetchInscriptionDetail = async () => {
    try {
      const data = await getNFTDetail({ contractAddress: contract, tokenId: id });
      setInscription(data);
    } catch (error) {
      router.push(ROUTE_PATH.NOT_FOUND);
    }
  };

  const isOwner = useMemo(
    () => userTcWallet === inscription?.owner,
    [inscription?.owner, userTcWallet],
  );

  const renderDetailsList = useMemo(() => {
    if (!inscription) return null;

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
            {collectionAddress}
          </Link>
        </div>
        <div className="list-item">
          <span>Content type</span>
          <span>{contentType}</span>
        </div>
        {inscription?.mintedAt && (
          <div className="list-item">
            <span>Timestamp</span>
            <span>{formatTimeStamp(mintedAt * 1000)}</span>
          </div>
        )}
      </StyledDetailList>
    );
  }, [inscription]);

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

  useEffect(() => {
    fetchInscriptionDetail();
  }, []);

  if (!inscription) {
    return <></>;
  }

  return (
    <Container>
      <div className="content">
        <div className="left-container">
          {inscription && (
            <NFTDisplayBox
              collectionID={inscription?.collectionAddress}
              contentClass="thumbnail"
              src={inscription.image}
              tokenID={inscription?.tokenId}
              type={inscription?.contentType}
            />
          )}
        </div>
        <div className="right-container">
          <div className="header">
            {inscription?.collection?.creator && (
              <p className="creator">{inscription?.collection?.creator}</p>
            )}
            <Link
              href={`${ROUTE_PATH.COLLECTION}?contract=${contract}`}
              className="title"
            >
              {contract.toLocaleLowerCase() === ARTIFACT_CONTRACT.toLocaleLowerCase()
                ? `Artifact #${inscription?.tokenId}`
                : collectionName}
            </Link>
            {inscription?.name !== collectionName && (
              <div className="token-name">
                <p>{inscription?.name}</p>
              </div>
            )}
          </div>

          <Accordion header="Artifact Details">{renderDetailsList}</Accordion>
          {inscription?.attributes && inscription?.attributes.length > 0 && (
            <Accordion header="Attribute">{renderAttributeList}</Accordion>
          )}
          {inscription?.activities && inscription?.activities.length > 0 && (
            <Accordion header="Activities">
              <ActivityList activities={inscription.activities} />
            </Accordion>
          )}
          {inscription?.makeOffers && inscription?.makeOffers.length > 0 && (
            <Accordion header="Offers">
              <OfferList offers={inscription.makeOffers} />
            </Accordion>
          )}
        </div>
      </div>
    </Container>
  );
};

export default React.memo(Inscription);
