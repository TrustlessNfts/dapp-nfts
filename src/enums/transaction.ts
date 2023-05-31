export enum TransactionStatus {
  PENDING = 'processing',
  CONFIRMED = 'confirmed',
  RESUME = 'pending',
}

export enum TransactionEventType {
  CREATE = 'create',
  TRANSFER = 'transfer',
  MINT = 'mint',
  BUY = 'buy',
  OFFER = 'offer',
  CANCEL_OFFER = 'cancel',
  ACCEPT_OFFER = 'accept',
  NONE = 'none',
}

export enum TokenActivityType {
  'Mint',
  'Listing',
  'Cancel listing',
  'Sale',
  'Transfer',
  'Make offer',
  'Cancel offer',
  'Accept offer',
  'Purchase',
}
