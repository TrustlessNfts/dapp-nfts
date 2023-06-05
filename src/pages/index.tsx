import { NextPage } from 'next';
import Layout from '@/layouts';
import Home from '@/containers/Home';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default HomePage;
