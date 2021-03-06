// SPDX-License-Identifier: MIT
/**
 * @title Enable
 * @dev admin can disable funtions
 */
pragma solidity >=0.4.22 <0.9.0;
import "../ownership/Claimable.sol";

contract Enable is Claimable {
    bool public enabled = true; // can functions be called

    event EnableStatusChanged(bool indexed enabled);

    /**
     * @dev Throws if enanled is false
     */
    modifier onlyEnabled() {
        require(enabled, 'Contract has been disabled by owner');
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
