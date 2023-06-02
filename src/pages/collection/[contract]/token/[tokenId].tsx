import { NextPage } from 'next';
import Layout from '@/layouts';
import TokenDetail from '@/containers/TokenDetail';

const TokenDetailPage: NextPage = () => {
  return (
    <Layout>
      <TokenDetail />
    </Layout>
  );
};

export default TokenDetailPage;
