import { ethers } from "ethers";
import { Sender__factory } from "../typechain-types";
import { RECEIVER_ADDRESS, SENDER_ADDRESS } from "./constansts";

export async function sendMessage(signer: ethers.Signer, textMessage: string) {
  const senderInstance = Sender__factory.connect(SENDER_ADDRESS, signer);

  const tx = await senderInstance.doSendMessage(RECEIVER_ADDRESS, textMessage);
  console.log("Transaction send", tx.hash);
  const receipt = await tx.wait();
  console.log("receipt", receipt);
}
