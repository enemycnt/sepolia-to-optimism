import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Sender", (m) => {
  const senderContract = m.contract("Sender", [
    "0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef",
  ]);

  return { senderContract };
});
