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

This implementation is agnostic to the way tokens are created. This means that a supply mechanism has to be added in a derived contract using `_mint`.

```solidity

pragma solidity ^0.4.24;

import "@cpchain-tools/cpchain-contracts/token/ERC20/ERC20.sol";

// mock class using ERC20
contract ERC20Mock is ERC20 {
    constructor (address initialAccount, uint256 initialBalance)
        ERC20("CBDD", "CPChain Big Data Dashboard", 18, 0) public {
        _mint(initialAccount, initialBalance);
    }

    // Mint token
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    // Burn token
    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    // burn allowanced token
    function burnFrom(address account, uint256 amount) public {
        _burnFrom(account, amount);
    }
}

```

## Test Helpers

This is a package to help users test contracts.

```bash

npm install @cpchain-tools/dapps-test-helpers

```

For example:

```javascript

const MathMock = artifacts.require('./mocks/MathMock.sol');
const { expect, BN  } = require('@cpchain-tools/dapps-test-helpers');

contract("MathMock", () => {
  const min = new BN('1234');
  const max = new BN('5678');
  let instance = null

  beforeEach(async ()=> {
    instance = await MathMock.new()
    assert.ok(instance)
  })

  // Max
  it('is correctly detected in first argument position', async function () {
    expect(await instance.max(max, min)).to.be.bignumber.equal(max);
  });

  it('is correctly detected in second argument position', async function () {
    expect(await instance.max(min, max)).to.be.bignumber.equal(max);
  });

})

```

## Building/Testing

```bash

npm run test:coverage

npm run build

```
