import { NextPage } from 'next';
import Layout from '@/layouts';
import CollectionDetail from '@/containers/CollectionDetail';

const CollectionDetailPage: NextPage = () => {
  return (
    <Layout>
      <CollectionDetail />
    </Layout>
  );
};

export default CollectionDetailPage;
