/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BN } from '@coral-xyz/anchor';
import {
  BONDING_CURVE_FEE_BIPS,
  PRECISION,
  VIRTUAL_TOKEN_RESERVE_WHEN_ADD_LIQUIDITY,
} from './constants';

export function getOutputTokenAmount(
  inputSolAmount_: number | bigint,
  virtualSolReserve_: number | bigint,
  virtualTokenReserve_: string | bigint
) {
  const inputSolAmount = BN(inputSolAmount_);
  const virtualSolReserve = new BN(virtualSolReserve_);
  const virtualTokenReserve = new BN(virtualTokenReserve_);
  let tax = inputSolAmount
    .mul(new BN(BONDING_CURVE_FEE_BIPS))
    .div(new BN(PRECISION));
  let amountBuy = inputSolAmount.sub(tax);
  let virtualTokenReserveAfter = virtualSolReserve
    .mul(virtualTokenReserve)
    .div(virtualSolReserve.add(amountBuy));
  if (
    virtualTokenReserveAfter
      .mul(virtualSolReserve.add(amountBuy))
      .lt(virtualSolReserve.mul(virtualTokenReserve))
  ) {
    virtualTokenReserveAfter = virtualTokenReserveAfter.add(new BN(1));
  }

  let amountOut: BN;
  let remainSolAmount = new BN(0);
  if (
    virtualTokenReserveAfter.lt(
      new BN(VIRTUAL_TOKEN_RESERVE_WHEN_ADD_LIQUIDITY)
    )
  ) {
    amountOut = virtualTokenReserve.sub(
      new BN(VIRTUAL_TOKEN_RESERVE_WHEN_ADD_LIQUIDITY)
    );
    let virtualSolReserveAfter = virtualSolReserve
      .mul(virtualTokenReserve)
      .div(new BN(VIRTUAL_TOKEN_RESERVE_WHEN_ADD_LIQUIDITY));
    if (
      virtualSolReserveAfter
        .mul(new BN(VIRTUAL_TOKEN_RESERVE_WHEN_ADD_LIQUIDITY))
        .lt(virtualSolReserve.mul(virtualTokenReserve))
    ) {
      virtualSolReserveAfter = virtualSolReserveAfter.add(new BN(1));
    }

    amountBuy = virtualSolReserveAfter.sub(virtualSolReserve);
    tax = amountBuy
      .mul(new BN(BONDING_CURVE_FEE_BIPS))
      .div(new BN(PRECISION - BONDING_CURVE_FEE_BIPS));

    remainSolAmount = inputSolAmount.sub(amountBuy).sub(tax);
  } else {
    amountOut = virtualTokenReserve.sub(virtualTokenReserveAfter);
  }

  return { amountOut, tax, remainSolAmount };
}

export function getOutputSolAmount(
  inputTokenAmount_: string | BN,
  virtualSolReserve_: number | BN,
  virtualTokenReserve_: string | BN
) {
  const inputTokenAmount = new BN(inputTokenAmount_);
  const virtualSolReserve = new BN(virtualSolReserve_);
  const virtualTokenReserve = new BN(virtualTokenReserve_);
  let virtualSolReserveAfter = virtualSolReserve
    .mul(virtualTokenReserve)
    .div(virtualTokenReserve.add(inputTokenAmount));
  if (
    virtualSolReserveAfter
      .mul(virtualTokenReserve.add(inputTokenAmount))
      .lt(virtualSolReserve.mul(virtualTokenReserve))
  ) {
    virtualSolReserveAfter = virtualSolReserveAfter.add(new BN(1));
  }

  const outBeforeTax = virtualSolReserve.sub(virtualSolReserveAfter);
  const tax = outBeforeTax
    .mul(new BN(BONDING_CURVE_FEE_BIPS))
    .div(new BN(PRECISION));
  return { outputSol: outBeforeTax.sub(tax), tax };
}
