import { NextPage } from 'next';
import Layout from '@/layouts';
import Collections from '@/containers/Collections';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Collections />
    </Layout>
  );
};

export default HomePage;
