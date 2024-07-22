import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://rpc.ankr.com/eth_sepolia",
      accounts: [PRIVATE_KEY],
    },
    optimism: {
      chainId: 11155420,
      url: "https://sepolia.optimism.io",
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
