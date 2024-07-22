import { ethers } from "ethers";

export async function recieveSenderTxReceipt(
  txId: string,
  ethProvider: ethers.Provider
) {
  const transaction = await ethProvider.getTransaction(txId);
  const receipt = await transaction?.wait();
  console.log("receipt", receipt);
  return receipt;
}
