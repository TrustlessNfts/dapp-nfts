/* eslint-disable jsx-a11y/anchor-is-valid */
import { IInscription } from '@/interfaces/api/inscription';
import { getNFTDetail } from '@/services/nft-explorer';
import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Container, Information } from './Inscription.styled';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ARTIFACT_CONTRACT } from '@/configs';
import { formatTimeStamp } from '@/utils/time';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import NFTDisplayBox from '@/components/NFTDisplayBox';

const Inscription = () => {
  const router = useRouter();
  const { contract, id } = queryString.parse(location.search) as { contract: string; id: string };
  const [inscription, setInscription] = useState<IInscription | undefined>();

  useEffect(() => {
    fetchInscriptionDetail();
  }, []);

  const fetchInscriptionDetail = async () => {
    try {
      const data = await getNFTDetail({ contractAddress: contract, tokenId: id });
      setInscription(data);
    } catch (error) {
      router.push(ROUTE_PATH.NOT_FOUND);
    }
  };

  const renderListItem = (title: string, desc?: string, link?: string) => {
    return (
      <div className="item">
        <p className="name">{title}</p>
        {link ? (
          <a className="link" href={link}>
            {desc}
          </a>
        ) : (
          <p className="desc">{desc}</p>
        )}
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProperties = (attributes: any[]) => (
    <div className="list-container">
      <p className="list-name">Attributes</p>
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 2,
          750: 2,
          900: 2,
          1240: 3,
          2500: 3,
          3000: 3,
        }}
      >
        <Masonry gutter="16px">
          {attributes.length > 0 &&
            attributes.map((trait, index) => {
              return (
                <div key={index.toString()} className="properties-item">
                  <p className="properties-trait-type">{trait.traitType}</p>
                  <p className="properties-trait-value">{trait.value}</p>
                </div>
              );
            })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );

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
            <p className="title">
              {contract.toLocaleLowerCase() === ARTIFACT_CONTRACT.toLocaleLowerCase()
                ? `Artifact #${inscription?.tokenId}`
                : inscription?.name}
            </p>
          </div>

          <Information>
            <p className="title">Information</p>
            <div className="list">
              {renderListItem('Owner', inscription?.owner)}
              {renderListItem('Contract', inscription?.collectionAddress)}
              {renderListItem('Content type', inscription?.contentType)}
              {inscription?.mintedAt && renderListItem('Timestamp', formatTimeStamp(inscription?.mintedAt * 1000))}
              {inscription &&
                inscription.attributes &&
                inscription.attributes.length > 0 &&
                renderProperties(
                  inscription.attributes.sort(function (a, b) {
                    if (a.traitType < b.traitType) {
                      return -1;
                    }
                    if (a.traitType > b.traitType) {
                      return 1;
                    }
                    return 0;
                  }),
                )}
            </div>
          </Information>
        </div>
      </div>
    </Container>
  );
};

export default React.memo(Inscription);
