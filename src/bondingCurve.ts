import {
  Address,
  Cell,
  Contract,
  ContractProvider,
  Message,
  Sender,
  Slice,
} from '@ton/core';
import { BondingCurve } from './build/Factory/tact_BondingCurve';
import { Buy, ClaimToken, Mint, Sell } from './build/Factory/tact_Factory';

export class BondingCurveSDK {
  bondingCurve: BondingCurve;
  provider: ContractProvider;
  constructor(provider: ContractProvider, bondingCurveAddress: Address) {
    this.provider = provider;
    this.bondingCurve = BondingCurve.fromAddress(bondingCurveAddress);
  }
  async mint(params: Mint, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.bondingCurve.send(this.provider, via, args, params);
  }
  async buy(params: Buy, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.bondingCurve.send(this.provider, via, args, params);
  }
  async sell(params: Sell, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.bondingCurve.send(this.provider, via, args, params);
  }
  async claim(params: ClaimToken, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.bondingCurve.send(this.provider, via, args, params);
  }
  async addLiquidity() {}
  async boughtBalance(address: Address) {
    return this.bondingCurve.getBoughtBalance(this.provider, address);
  }
}
