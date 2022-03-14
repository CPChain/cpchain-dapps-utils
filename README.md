# cpchain-dapps-utils

A tool library for creating dapps

![Test Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/zhangkai-cpchain/06366dbf3a2e32b6cd670932952dbe3d/raw/cpchain-dapps-utils__heads_main.json)

## Installation and Usage

```bash

npm install @cpchain-tools/cpchain-contracts

```

### Ownership

```solidity

import "@cpchain-tools/cpchain-contracts/ownership/Ownable.sol" 
contract Example is Ownable {
    function ownerGreet() public view onlyOwner returns (string) {
        return "Hello,Owner";
    }
}

```

Claimable need next owner send transaction to transfer ownership

```solidity

import "@cpchain-tools/cpchain-contracts/ownership/Ownable.sol"
contract Example is Claimable {
    function ownerGreet() public view onlyOwner returns (string) {
        return "Hello,Owner";
    }
}

```

### Lifecycle

```solidity

import "@cpchain-tools/cpchain-contracts/lifecyle/Enable.sol"

contract Example is Enable {
    function enableGreet() public view onlyEnabled returns (string) {
        return "enabled";
    }
}

```

### Set

### SafeMath

Arithmetic operations in Solidity wrap on overflow. This can easily result in bugs, because programmers usually assume that an overflow raises an error, which is the standard behavior in high level programming languages. `SafeMath` restores this intuition by reverting the transaction when an operation overflows.

```solidity

pragma solidity ^0.4.24;

import "@cpchain-tools/cpchain-contracts/utils/math/SafeMath.sol";

contract SafeMathMock {
    function mul(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.mul(a, b);
    }

    function div(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.div(a, b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.sub(a, b);
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.add(a, b);
    }

    function mod(uint256 a, uint256 b) public pure returns (uint256) {
        return SafeMath.mod(a, b);
    }
}

```

### ERC20

```solidity



```

## Building/Testing

```bash

npm run test:coverage

npm run build

```
