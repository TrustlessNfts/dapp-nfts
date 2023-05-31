import { NextPage } from 'next';
import Layout from '@/layouts';
import Inscription from '@/containers/InscriptionItem';

const InscriptionPage: NextPage = () => {
  return (
    <Layout>
      <Inscription />
    </Layout>
  );
};

export default InscriptionPage;
