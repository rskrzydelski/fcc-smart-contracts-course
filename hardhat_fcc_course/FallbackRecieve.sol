// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// special functions are without function keyword

contract FallbackRecieve {
    uint256 public result;

    // this function is triggered only when calldata is blank
    receive() external payable {
        result = 1;
    }

    // this function is triggered if you send some calldata which not fit to any function within a contract
    fallback() external payable {
        result = 2;
    }
}