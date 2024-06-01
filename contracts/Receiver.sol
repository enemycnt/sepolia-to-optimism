// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Receiver {
    event Message(address indexed sender, string text);

    function handleMessage(address sender,string calldata text) public {
      emit Message(sender, text);
    }
}
