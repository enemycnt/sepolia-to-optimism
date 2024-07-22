# Sepolia to Optimism message bridge
This Hardhat project implements secure cross-domain message passing between the Sepolia and Optimism networks using `Sender` and `Receiver` smart contracts.

Source code of smartcontracts is at [`./contracts`](./contracts/)

[> Live test dApp <](https://sepolia-to-optimism-next.vercel.app/) Source code of dapp in [next-frotend](./next-frontend/)

### Features:

- **Cross-Domain Messaging**. Utilizes an interface (`IL1CrossDomainMessenger`) to send messages across different blockchain networks (Sepolia to Optimism).

- **Event Emission**. Emits a `Message` event in the `Receiver` contract to log incoming messages, including the sender, text, and nonce.

- **Nonce Management**. Maintains a `nonce` in the `Sender` contract to ensure the uniqueness of each message and prevent replay attacks.

- **Access Control**. Uses OpenZeppelin's `Ownable` contract to restrict certain functions (like pausing and unpausing the contract) to the contract owner.

- **Contract Pausability**. Incorporates OpenZeppelin's `Pausable` contract to allow the owner to enable or disable the `Sender` contract's `doSendMessage` function.

- **Reentrancy Protection**. Applies OpenZeppelin's `ReentrancyGuard` to the `Sender` contract to prevent reentrancy attacks.

- **Message Validation**. Validates that the `text` parameter in the `doSendMessage` function is not empty and does not exceed a specified maximum length (256 characters).

- **Authorized Sender Check**. Ensures that the `Receiver` contract only accepts messages from a specific authorized sender address (`0x4200000000000000000000000000000000000007`).

### Sender Contract:

[Source code](./contracts/Sender.sol)

The `Sender` contract is responsible for sending messages from the Sepolia network to the Optimism sepolia network. It ensures each message is unique using a nonce, validates the message content, and can be paused or unpaused by the contract owner to control its functionality.

### Receiver Contract:

[Source code](./contracts/Receiver.sol)

The `Receiver` contract on the Optimism network handles incoming messages from the `Sender` contract. It logs the messages with the sender's address, message text, and nonce, and only accepts messages from a specific authorized sender address.

### Summary

The `Sender` and `Receiver` smart contracts are designed to facilitate secure and controlled cross-domain messaging between the Sepolia and Optimism networks. By leveraging OpenZeppelin's libraries, the contracts implement robust security measures such as access control, reentrancy protection, and pausability. Input validation ensures message integrity, and nonce management prevents replay attacks. The `Receiver` contract strictly enforces that messages are only accepted from a designated authorized sender, enhancing security.

## Instructions

To deploy these smartcontracts with Hardhat:

### Localhost

Deploy Sender only:

```shell
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

### Testnets

From Ethereum Sepolia to Optimism Sepolia:

```sh
# Sender contract to sepolia
npx hardhat ignition deploy ignition/modules/Sender.ts --network sepolia
# Reciever contract to optimism
npx hardhat ignition deploy ignition/modules/Receiver.ts --network optimism
```


