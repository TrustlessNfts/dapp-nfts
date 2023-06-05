import { NextPage } from 'next';
import Layout from '@/layouts';
import Collections from '@/containers/Collections';

const CollectionPage: NextPage = () => {
  return (
    <Layout>
      <Collections />
    </Layout>
  );
};

export default CollectionPage;
