export interface IGetWalletBNSInfoResponse {
  id: string;
  tokenId: string;
  tokenIdInt: number;
  name?: string;
  owner: string;
  collectionAddress: string;
  resolver: string;
  pfp?: string;
  pfpData?: {
    gcsUrl: string;
    filename: string;
  };
}
