import { GetServerSidePropsContext, NextPage } from 'next';
import Layout from '@/layouts';
import CollectionDetail from '@/containers/CollectionDetail';
import { getCollectionDetail } from '@/services/nft-explorer';
import { ROUTE_PATH } from '@/constants/route-path';
import { SEO_DESCRIPTION, SEO_IMAGE, SEO_TITLE } from '@/constants/seo';

const CollectionDetailPage: NextPage = () => {
  return (
    <Layout>
      <CollectionDetail />
    </Layout>
  );
};

export default CollectionDetailPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { contract } = query as { contract: string };

  try {
    const data = await getCollectionDetail({ contractAddress: contract });

    return {
      props: {
        seoInfo: {
          title: `${SEO_TITLE} | ${data.name} `,
          description: data.description || SEO_DESCRIPTION,
          image: data.thumbnail || SEO_IMAGE,
        },
      },
    };
  } catch (err: unknown) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.NOT_FOUND,
      },
    };
  }
}
