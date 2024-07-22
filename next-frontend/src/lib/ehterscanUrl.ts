import { OPTIMISM_ETHERSCAN_BASE, SEPOLIA_ETHERSCAN_BASE } from "./constansts";

export function etherscanOptimismUrl(txHash: string) {
  return `${OPTIMISM_ETHERSCAN_BASE}${txHash}#eventlog`;
}

export function etherscanSepoliaUrl(txHash: string) {
  return `${SEPOLIA_ETHERSCAN_BASE}${txHash}#eventlog`;
}
