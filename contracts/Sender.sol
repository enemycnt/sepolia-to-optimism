// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Receiver.sol";

// extracted from original contract
interface IL1CrossDomainMessenger {
    function sendMessage(
        address _to,
        bytes memory _data,
        uint32 _gasLimit
    ) external;
}

contract Sender {
    IL1CrossDomainMessenger public messenger;

    constructor(address l1CrossDomainMessengerAddress) {
        messenger = IL1CrossDomainMessenger(l1CrossDomainMessengerAddress);
    }

    function doSendMessage(
        address opReceiverContractAddress,
        string calldata text
    ) public {
        address sender = msg.sender;

        messenger.sendMessage(
            opReceiverContractAddress,
            abi.encodeCall(Receiver.handleMessage, (sender, text)),
            1000000
        );
    }
}
