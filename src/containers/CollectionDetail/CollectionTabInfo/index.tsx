import React from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from "./CollectionTabInfo.styled";
import TokenList from "../TokenList";
import { ICollection } from "@/interfaces/api/marketplace";

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
        defaultActiveKey="items"
        id="collection-data"
        className="tabs"
      >
        <Tab
          mountOnEnter
          eventKey="items"
          title={`Item (${collection?.totalItems})`}>
          <TokenList collection={collection}/>
        </Tab>
      </Tabs>
    </Wrapper>
  )
}

export default CollectionTabInfo;