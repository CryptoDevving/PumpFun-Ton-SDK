import {
  Address,
  Cell,
  Contract,
  ContractABI,
  ContractProvider,
  Message,
  Sender,
} from '@ton/core';
import {
  BuyCall,
  DeployCurveParams,
  Factory,
  loadSendParameters,
  SellCall,
} from './build/Factory/tact_Factory';
import TonConnect from '@tonconnect/sdk';
export class FactorySDK {
  factory: Factory;
  provider: ContractProvider;
  constructor(provider: ContractProvider, factoryAddress: Address) {
    this.provider = provider;
    this.factory = Factory.fromAddress(factoryAddress);
  }
  async buyCall(params: BuyCall, via: Sender) {
    const args = { value: BigInt(params.tonAmount), bounce: true };
    return this.factory.send(this.provider, via, args, params);
  }
  async sellCall(params: SellCall, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.factory.send(this.provider, via, args, params);
  }
  async deployCurveParams(params: DeployCurveParams, via: Sender) {
    const args = { value: BigInt(0), bounce: true };
    return this.factory.send(this.provider, via, args, params);
  }
}
