import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from "./CollectionData.styled";
import AllCollectionsTab from "../AllCollectionsTab";
import { useSelector } from "react-redux";
import { getUserSelector } from "@/state/user/selector";
import MyCollectionsTab from "../MyCollectionsTab";

const CollectionData: React.FC = (): React.ReactElement => {
  const user = useSelector(getUserSelector);

  return (
    <Wrapper>
      <Tabs
        defaultActiveKey="all"
        id="collection-data"
        className="tabs"
      >
        <Tab
          mountOnEnter
          eventKey="all"
          title={'Collections'}>
          <AllCollectionsTab />
        </Tab>
        {user.walletAddress && (
          <Tab
            eventKey="my-collections"
            title={'My collections'}>
            <MyCollectionsTab />
          </Tab>
        )}
      </Tabs>
    </Wrapper>
  );
}

export default CollectionData;
