# cpchain-dapps-utils

A tool library for creating dapps
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