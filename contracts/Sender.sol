// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IL1CrossDomainMessenger
 * @dev Interface for the cross-domain messenger contract.
 */
interface IL1CrossDomainMessenger {
    function sendMessage(
        address _to,
        bytes memory _data,
        uint32 _gasLimit
    ) external;
}

/**
 * @title Sender
 * @dev A contract to send messages to the Receiver contract on another network.
 */
contract Sender is ReentrancyGuard, Ownable, Pausable {
    IL1CrossDomainMessenger public messenger;
    uint256 public nonce; // Nonce to ensure uniqueness of messages
    uint256 public constant MAX_TEXT_LENGTH = 256; // Maximum allowed length for the message text

    /**
     * @dev Emitted when a message is sent.
     * @param sender The address that sent the message.
     * @param text The content of the message.
     * @param nonce The unique nonce of the message.
     */
    event MessageSent(address indexed sender, string text, uint256 nonce);

    /**
     * @dev Sets the messenger contract address.
     * @param l1CrossDomainMessengerAddress The address of the cross-domain messenger contract.
     */
    constructor(address l1CrossDomainMessengerAddress) Ownable(msg.sender) {
        messenger = IL1CrossDomainMessenger(l1CrossDomainMessengerAddress);
    }

    /**
     * @dev Sends a message to the Receiver contract.
     * @param opReceiverContractAddress The address of the Receiver contract on the Optimism network.
     * @param text The content of the message.
     */
    function doSendMessage(
        address opReceiverContractAddress,
        string calldata text
    ) public nonReentrant whenNotPaused {
        require(bytes(text).length > 0, "Text cannot be empty");
        require(
            bytes(text).length <= MAX_TEXT_LENGTH,
            "Text exceeds maximum length"
        );

        address sender = msg.sender;

        uint256 currentNonce = nonce;
        nonce++; // Increment nonce atomically

        messenger.sendMessage(
            opReceiverContractAddress,
            abi.encodeCall(
                Receiver.handleMessage,
                (sender, text, currentNonce)
            ),
            1000000
        );
        // Emit the event after sending the message
        emit MessageSent(sender, text, currentNonce);
    }

    /**
     * @dev Pauses the contract, disabling the doSendMessage function.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract, enabling the doSendMessage function.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
