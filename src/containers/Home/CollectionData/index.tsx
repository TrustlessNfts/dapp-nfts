import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from "./CollectionData.styled";
import CollectionsTab from "../CollectionsTab";

const CollectionData: React.FC = (): React.ReactElement => {
  return (
    <Wrapper>
      <Tabs
        defaultActiveKey="all"
        id="collection-data"
        className="tabs"
      >
        {/* <Tab
          eventKey="trending"
          title={'Trending collections'}>
          Tab content for Home
        </Tab> */}
        <Tab
          mountOnEnter
          eventKey="all"
          title={'Collections'}>
          <CollectionsTab />
        </Tab>
      </Tabs>
    </Wrapper>
  );
}

export default CollectionData;
