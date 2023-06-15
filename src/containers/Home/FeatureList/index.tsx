import Button from '@/components/Button';
import Text from '@/components/Text';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { useRouter } from 'next/router';
import { Carousel } from 'react-responsive-carousel';
import { StyledFeatureList } from './FeatureList.styled';

const FeatureList = () => {
  const router = useRouter();

  const listThumbs = [
    {
      image: `${CDN_URL}/pages/nfts/thumnail-sudo.png`,
      collectionAddress: '0x9841faa1133da03b9ae09e8daa1a725bc15575f0',
      name: 'Sudos',
    },
    {
      image: `${CDN_URL}/pages/nfts/thumbnail-nomad.png`,
      collectionAddress: '0x8cd8d807fdcf51ca373f10fe638dcd9193442e51',
      name: 'Noble Nomad',
    },
    {
      image: `${CDN_URL}/pages/nfts/thumbnail-retro.png`,
      collectionAddress: '0xaa924ee5475e90bf031645d5396258413e7b409b',
      name: 'Retrospecs',
    },
    {
      image: `${CDN_URL}/pages/nfts/thumbnail-kpop.png`,
      collectionAddress: '0x2076f1b492df162804c723b3e0456abcb4abee53',
      name: 'K-Pops',
    },
    {
      image: `${CDN_URL}/pages/nfts/thumbnail-si.png`,
      collectionAddress: '0x16efdc6d3f977e39dac0eb0e123feffed4320bc0',
      name: 'Smart Inscriptions',
    },
  ];

  return (
    <StyledFeatureList>
      <Carousel autoPlay showArrows={false} showStatus={false} showThumbs={false}>
        {listThumbs.map((item, index) => (
          <div className="feature-item" key={index}>
            <div className="thumbnail-wrapper">
              <img src={item.image} alt="thumbnail" />
            </div>
            <div className="collection-info">
              <div className="collection-detail">
                <Text size="large" fontWeight="bold">
                  {item.name}
                </Text>
              </div>
              <div>
                <Button
                  type="button"
                  bg="#1A1A1A"
                  className="view-btn"
                  background={'#1A1A1A'}
                  onClick={() =>
                    router.push(`${ROUTE_PATH.COLLECTION}/${item.collectionAddress}`)
                  }
                >
                  View collection
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </StyledFeatureList>
  );
};

export default FeatureList;
