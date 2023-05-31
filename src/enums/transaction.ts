export enum TransactionStatus {
  PENDING = 'processing',
  CONFIRMED = 'confirmed',
  RESUME = 'pending',
}

export enum TransactionEventType {
  CREATE = 'create',
  TRANSFER = 'transfer',
  MINT = 'mint',
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
