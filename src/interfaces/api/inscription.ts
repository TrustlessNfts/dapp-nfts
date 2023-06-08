import { IMAGE_TYPE } from '@/components/NFTDisplayBox/constant';
import { ICollection } from './collection';

export interface IInscription {
  id: string;
  collection: ICollection;
  name: string;
  tokenId: string;
  tokenUri: string;
  attributes: [{ traitType: string; value: string }];
  metadataType: string;
  contentType: IMAGE_TYPE;
  createdAt: string;
  updatedAt: string;
  mintedAt: number;
  collectionAddress: string;
  owner: string;
  image?: string;
  activities?: IInscriptionActivity[];
  listingForSales?: IInscriptionLisftingForSale[];
  makeOffers?: IInscriptionOffer[];
  buyable: boolean;
}

export interface IInscriptionActivity {
  baseEntity: {
    id: string;
    deletedAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  type: number;
  title: string;
  userAAddress: string | null;
  userBAddress: string | null;
  amount: number;
  erc20Address: string;
  time: string | null;
  inscriptionId: string;
  collectionContract: string;
  offeringId: string;
  blockNumber: number;
  txHash: string;
  logIndex: number;
}
export interface IInscriptionOffer {
  id: string;
  deletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  offeringId: string;
  collectionContract: string;
  tokenId: string;
  buyer: string;
  erc20Token: string;
  price: number;
  status: number;
  durationTime: number;
  blockNumber: number;
  ownerAddress: string | null;
}

export interface IInscriptionLisftingForSale {
  id: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt?: string;
  offeringId: string;
  collectionContract: string;
  tokenId: string;
  seller: string;
  erc20Token: string;
  price: string;
  status: number;
  durationTime: number;
  blockNumber: number;
  ownerAddress?: string;
}
