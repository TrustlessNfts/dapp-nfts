import { isBrowser } from "@trustless-computer/dapp-core"

export const setCacheApprovalPermission = (key: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(`${key.toLowerCase()}__collection_aprroved`, 'true');
}

export const checkCacheApprovalPermission = (key: string): boolean => {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(`${key.toLowerCase()}__collection_aprroved`);
  if (data && data === 'true') {
    return true;
  }
  return false;
}

export const setCacheApprovalTokenPermission = (key: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(`${key.toLowerCase()}__token_aprroved`, 'true');
}

export const checkCacheApprovalTokenPermission = (key: string): boolean => {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(`${key.toLowerCase()}__token_aprroved`);
  if (data && data === 'true') {
    return true;
  }
  return false;
}