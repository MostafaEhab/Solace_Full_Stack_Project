const ReviewTag = {
  POLITE: 'POLITE',
  ON_TIME: 'ON_TIME',
  RESPONSIBLE: 'RESPONSIBLE',
};
Object.freeze(ReviewTag);

const InteractionType = {
  REQUESTER: 'REQUESTER',
  EXECUTER: 'EXECUTER',
};
Object.freeze(InteractionType);

const OfferTag = {
  URGENT: 'URGENT',
  PRO: 'PRO',
  PAINTING: 'PAINTING',
  REPAIR: 'REPAIR',
  OTHER: 'OTHER',
};
Object.freeze(OfferTag);

const OfferState = {
  NEW: 'NEW',
  MATCHED: 'MATCHED',
  PAID: 'PAID',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};
Object.freeze(OfferState);

const City = {
  MUNICH: 'MUNICH',
  BERLIN: 'BERLIN',
  HAMBURG: 'HAMBURG',
  FRANKFURT: 'FRANKFURT',
  LEIPZIG: 'LEIPZIG',
  DRESDEN: 'DRESDEN',
  BREMEN: 'BREMEN',
  POTSDAM: 'POTSDAM',
};
Object.freeze(City);

const Currency = {
  EUR: 'EUR',
  USD: 'USD',
};
Object.freeze(Currency);

const TransactionState = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};
Object.freeze(TransactionState);

const PaymentType = {
  PAYPAL: 'PAYPAL',
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
};
Object.freeze(PaymentType);

const ReviewPoints = {
  HALF: 0.5,
  ONE: 1,
  ONEHALF: 1.5,
  TWO: 2,
  TWOHALF: 2.5,
  THREE: 3,
  THREEHALF: 3.5,
  FOUR: 4,
  FOURHALF: 4.5,
  FIVE: 5,
};

module.exports = {
  ReviewTag,
  InteractionType,
  OfferTag,
  OfferState,
  City,
  Currency,
  TransactionState,
  PaymentType,
  ReviewPoints,
};
