import React, { useCallback } from 'react';
import { useMintingCalculations } from '@/hooks/useMintingCalculations';
import { MintToken } from '@/types/mint';

const formatMintRateForToken = (token: MintToken) => {
  const { getFormattedMintRate } = useMintingCalculations({
    totalSupply: token.totalSupply,
    target: token.target,
    mintRate: token.mintRate,
    currencyUnit,
    tokenDecimals: 6
  });
  
  const rate = token.mintRate || getFormattedMintRate();
  return rate ? rate.replace(/,/g, '') : rate;
}

export default formatMintRateForToken; 