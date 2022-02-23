// SPDX-License-Identifier: MIT
/**
 * @title Enable
 * @dev admin can disable funtions
 */
pragma solidity >=0.4.22 <0.9.0;
import "./Ownable.sol";

contract Enable is Ownable {
    bool public enabled = true; // can functions be called

    event EnableStatusChanged(bool indexed enabled);

    /**
     * @dev Throws if enanled is false
     */
    modifier onlyEnabled() {
        require(enabled);
        _;
    }

    /**
     * @dev set contract enable
     */
    function enableContract() public onlyOwner {
        enabled = true;
        emit EnableStatusChanged(enabled);
    }

    /**
     * @dev set contract disable
     */
    function disableContract() public onlyOwner {
        enabled = false;
        emit EnableStatusChanged(enabled);
    }
}
