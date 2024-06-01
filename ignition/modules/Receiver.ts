import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Receiver", (m) => {
  const receiverContract = m.contract("Receiver");

  return { receiverContract };
});
