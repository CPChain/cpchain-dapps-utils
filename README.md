# cpchain-dapps-utils

A tool library for creating dapps

![Test Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/zhangkai-cpchain/06366dbf3a2e32b6cd670932952dbe3d/raw/cpchain-dapps-utils__heads_main.json)

## Installation and Usage

```bash
npm install @cpchain-tools/cpchain-dapps-utils
```

### Ownership

```javascript
import "@cpchain-tools/cpchain-dapps-utils/contracts/ownership/Ownable.sol" 
contract Example is Ownable {
    function ownerGreet() public view onlyOwner returns (string) {
        return "Hello,Owner";
    }
}
```

Claimable need next owner send transaction to transfer ownership

```javascript
import "@cpchain-tools/cpchain-dapps-utils/contracts/ownership/Ownable.sol"
contract Example is Claimable {
    function ownerGreet() public view onlyOwner returns (string) {
        return "Hello,Owner";
    }
}
```

### Lifecycle

```javascript
import "@cpchain-tools/cpchain-dapps-utils/contracts/lifecyle/Enable.sol"

contract Example is Enable {
    function enableGreet() public view onlyEnabled returns (string) {
        return "enabled";
    }
}
```

### Set

### SafeMath

### Base ERC20

## Building/Testing

```bash
npm run build
npm run test:coverage
```