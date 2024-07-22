import { Sender } from "@/typechain-types";
import { ethers } from "ethers";

export async function getMessageSentEvent(
  receipt: ethers.TransactionReceipt,
  senderInstance: Sender
) {
  const messageSentEventLog = receipt?.logs
    .map((log) => senderInstance.interface.parseLog(log))
    .findLast((el) => el && el.name === "MessageSent")?.args;

  const messageSentEvent = messageSentEventLog?.toObject();
  console.log("message sent event", messageSentEvent);
  return messageSentEventLog;
}
