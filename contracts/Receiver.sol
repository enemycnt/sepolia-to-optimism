// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

/**
 * @title Receiver
 * @dev A contract to handle and log received messages.
 */
contract Receiver {
    address public constant allowedSender =
        0x4200000000000000000000000000000000000007; // The contract only permits calls from the L2CrossDomainMessenger contract

    /**
     * @dev Emitted when a message is received.
     * @param sender The address that sent the message.
     * @param text The content of the message.
     * @param nonce The unique nonce of the message.
     */
    event Message(address indexed sender, string text, uint256 indexed nonce);

    /**
     * @dev Handles incoming messages and emits the Message event.
     * @param sender The address that sent the message.
     * @param text The content of the message.
     * @param nonce The unique nonce of the message.
     */
    function handleMessage(
        address sender,
        string calldata text,
        uint256 nonce
    ) public {
        require(msg.sender == allowedSender, "Sender not authorized");
        emit Message(sender, text, nonce);
    }
}
