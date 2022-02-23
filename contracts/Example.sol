// SPDX-License-Identifier: MIT
/**
 * @title exmple for lib
 * @dev admin can disable funtions
 */
pragma solidity >=0.4.22 <0.9.0;

import "./lib/Enable.sol";

contract Example is Enable {
    function greet() public view onlyEnabled returns (string) {
        return "User";
    }

    function ownerGreet() public view onlyOwner returns (string) {
        return "Owner";
    }
}
