import { ROUTE_PATH } from '@/constants/route-path';
import { SEO_DESCRIPTION, SEO_IMAGE, SEO_TITLE } from '@/constants/seo';
import TokenDetail from '@/containers/TokenDetail';
import Layout from '@/layouts';
import logger from '@/services/logger';
import { getNFTDetail } from '@/services/nft-explorer';
import { GetServerSidePropsContext, NextPage } from 'next';

const TokenDetailPage: NextPage = () => {
  return (
    <Layout hideFooter>
      <TokenDetail />
    </Layout>
  );
};

export default TokenDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { contract, tokenId } = query as { contract: string; tokenId: string };

  try {
    const data = await getNFTDetail({ contractAddress: contract, tokenId: tokenId });

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | ${data.name} `,
          description: SEO_DESCRIPTION,
          image: data?.image || SEO_IMAGE,
        },
      },
    };
  } catch (err: unknown) {
    logger.error(err);
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.NOT_FOUND,
      },
    };
  }
}
