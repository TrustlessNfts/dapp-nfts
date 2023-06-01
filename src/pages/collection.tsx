import { ROUTE_PATH } from '@/constants/route-path';
import { SEO_IMAGE, SEO_TITLE } from '@/constants/seo';
import CollectionDetail from '@/containers/CollectionDetail';
import Layout from '@/layouts';
import { getCollectionDetail } from '@/services/nft-explorer';
import { GetServerSidePropsContext, NextPage } from 'next';

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
          description: data.description || '',
          image: data.thumbnail || SEO_IMAGE,
        },
      },
    };
  } catch (err: unknown) {
    console.log(err)
    return {
      redirect: {
        permanent: false,
        destination: ROUTE_PATH.NOT_FOUND,
      },
    };
  }
}
