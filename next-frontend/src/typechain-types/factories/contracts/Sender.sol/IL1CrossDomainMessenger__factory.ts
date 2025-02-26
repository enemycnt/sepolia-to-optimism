/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IL1CrossDomainMessenger,
  IL1CrossDomainMessengerInterface,
} from "../../../contracts/Sender.sol/IL1CrossDomainMessenger";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "uint32",
        name: "_gasLimit",
        type: "uint32",
      },
    ],
    name: "sendMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IL1CrossDomainMessenger__factory {
  static readonly abi = _abi;
  static createInterface(): IL1CrossDomainMessengerInterface {
    return new Interface(_abi) as IL1CrossDomainMessengerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IL1CrossDomainMessenger {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as IL1CrossDomainMessenger;
  }
}
