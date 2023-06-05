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
}

export interface IGetCollectionListParams extends IPagingParams {
  owner?: string;
  contract?: string;
  allow_empty?: boolean;
  name?: string;
  sort_by?: string;
  sort?: number;
}