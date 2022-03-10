// SPDX-License-Identifier: MIT
/**
 * @title exmple for lib
 * @dev admin can disable funtions
 */
pragma solidity >=0.4.22 <0.9.0;

import "../ownership/Ownable.sol";

contract OwnableMock is Ownable {
    function greet() public pure returns (string) {
        return "User";
    }

    function ownerGreet() public view onlyOwner returns (string) {
        return "Owner";
    }
}
