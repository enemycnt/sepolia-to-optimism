import { ethers, toBeHex } from "ethers";
async function switchNetwork() {
  // @ts-expect-error-line
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toBeHex(11155111) }], // chainId must be in HEX with 0x in front
  });
}
export async function connectToMetamask() {
  switchNetwork();
  // @ts-expect-error-line
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}
