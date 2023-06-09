import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from "./CollectionTabInfo.styled";
import { ICollection } from "@/interfaces/api/marketplace";
import CollectionDescription from "../CollectionDescription";

interface IProps {
  collection: ICollection | null;
}

const CollectionTabInfo: React.FC<IProps> = ({collection}: IProps): React.ReactElement => {
  if (!collection) {
    return <></>
  }

  return (
    <Wrapper>
      <Tabs
        defaultActiveKey="description"
        id="collection-info"
        className="tabs"
      >
        <Tab
          mountOnEnter
          eventKey="description"
          title={`Description`}>
          <CollectionDescription collection={collection} />
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export default CollectionTabInfo;