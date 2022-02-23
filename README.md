# cpchain-dapps-utils

A tool library for creating dapps
![Test Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/zhangkai-cpchain/06366dbf3a2e32b6cd670932952dbe3d/raw/cpchain-dapps-utils__heads_main.json)

## Installation and Usage

```bash
npm install @cpchain-tools/cpchain-dapps-utils
```

```javascript
import "@cpchain-tools/cpchain-dapps-utils/contracts/lib/Ownable.sol"

contract Example is Ownable {
    function ownerGreet() public view onlyOwner returns (string) {
        return "Hello,Owner";
    }
}
```

## Building/Testing

```bash
npm run build
npm run test:coverage
```