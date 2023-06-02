export const walletLinkSignTemplate = ({
  operationName,
  dAppType,
  hash,
  isRedirect,
}: {
  operationName: string;
  dAppType: string;
  hash: string;
  isRedirect: boolean;
}) => {
  return `https://trustlesswallet.io/?function=sign&hash=${hash}&method=${operationName}%20${dAppType}&dappURL=${window.location.origin}&isRedirect=${isRedirect}`;
};
