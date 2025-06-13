
import React from 'react';
import { blockchains } from './formUtils';

export const simulateTransactionHash = () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getExplorerUrl = (blockchainValue, txHash) => {
  const blockchainInfo = blockchains.find(b => b.value === blockchainValue);
  if (blockchainInfo && blockchainInfo.explorer && txHash) {
    return `${blockchainInfo.explorer}${txHash}`;
  }
  return '';
};
