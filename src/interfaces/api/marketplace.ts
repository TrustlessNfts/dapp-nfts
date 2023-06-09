import { IPagingParams } from "./query";

export interface ICollectionSocial {
  website: string;
  discord: string;
  twitter: string;
  telegram: string;
  medium: string;
  instagram: string;
}

export interface ICollection {
  id: string;
  createdAt: string;
  slug: string;
  contractType: string;
  contract: string;
  creator: string;
  totalItems: number;
  totalOwners: number;
  index: number;
  deployedAtBlock: number;
  thumbnail: string;
  name: string;
  social: ICollectionSocial;
  status: number;
  totalSales: number;
  uniqueOwners: number;
  floorPrice: number;
  volume: number;
  description: string;
}

export interface ITokenSaleInfo {
  id: string;
  createdAt: string;
  offeringId: string;
  collectionContract: string;
  tokenId: string;
  seller: string;
  erc20Token: string;
  price: string;
  status: number;
  blockNumber: number;
  durationTime: string;
}

export interface IErc20PriceInfo {
  offeringId: string;
  tokenId: string;
  erc20Token: string;
  price: string;
}

export interface IToken {
  collectionAddress: string;
  tokenId: string;
  contentType: string;
  name: string;
  owner: string;
  tokenUri: string;
  image: string;
  mintedAt: number;
  listingForSales: Array<ITokenSaleInfo>;
  buyable: boolean;
  priceErc20: IErc20PriceInfo;
  collection: ICollection;
  size: number;
}

export interface IGetCollectionListParams extends IPagingParams {
  owner?: string;
  contract?: string;
  allow_empty?: boolean;
  name?: string;
  sort_by?: string;
  sort?: number;
}

export interface IGetCollectionNFTListParams extends IPagingParams {
  rarity?: string;
  attributes?: string;
  token_id?: string;
  is_big_file?: boolean;
  sort_by?: string;
  sort?: string;
  contract_address: string;
}

export interface IGetCollectionActivityListParams extends IPagingParams {
  status?: number;
  contract_address: string;
}

export interface ICollectionActivity {
  type: number;
  title: string;
  userAAddress: string;
  userBAddress: string;
  amount: string;
  erc20Address: string;
  time: string;
  tokenId: string;
  collectionContract: string;
  offeringId: string;
  blockNumber: number;
  txHash: string;
  thumbnail: string;
}
