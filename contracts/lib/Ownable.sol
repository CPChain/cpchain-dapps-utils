// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * Ownable
 * The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address public owner;

    address public reserveOwner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    event ReserveOwnerSetted(
        address indexed owner,
        address indexed reserveOwner
    );

    /**
     *  The Ownable constructor sets the original `owner` of the contract to the sender
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * Allows the current owner to set the reserve owner for contract.
     * If the reserve owner performs a claim operation, ownership transfer completed.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        reserveOwner = newOwner;
        emit ReserveOwnerSetted(owner, reserveOwner);
    }

    /**
     * The reserve owner claim the ownership for contract.
     * Need to send a transaction to make sure the new owner address is available
     */
    function claimOwnership() public {
        require(msg.sender == reserveOwner);
        emit OwnershipTransferred(owner, reserveOwner);
        owner = reserveOwner;
    }
}
