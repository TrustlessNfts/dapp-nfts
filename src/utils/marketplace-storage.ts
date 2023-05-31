import { isBrowser } from "@trustless-computer/dapp-core"

export const setCacheApprovalPermission = (key: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem(`${key}__aprroved`, 'true');
}

export const checkCacheApprovalPermission = (key: string): boolean => {
  if (!isBrowser()) return false;
  const data = localStorage.getItem(`${key}__aprroved`);
  if (data && data === 'true') {
    return true;
  }
  return false;
}