import { NextPage } from 'next';
import Layout from '@/layouts';
import Inscription from '@/containers/InscriptionDetail';

const InscriptionPage: NextPage = () => {
  return (
    <Layout>
      <Inscription />
    </Layout>
  );
};

export default InscriptionPage;
