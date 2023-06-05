import React from 'react';
import Banner from './Banner';
import CollectionData from './CollectionData';

const Home: React.FC = (): React.ReactElement => {
  return (
    <div>
      <Banner />
      <CollectionData />
    </div>
  )
}

export default Home;