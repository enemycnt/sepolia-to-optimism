import { ETHERSCAN_BASE } from "./constansts";

export function etherscanBalanceUrl(txHash: string) {
  return `${ETHERSCAN_BASE}/${txHash}#eventlog`;
}
