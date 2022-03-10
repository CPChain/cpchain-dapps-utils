// Deploy Example
var Example = artifacts.require("./Example.sol");
var OwnerExample = artifacts.require("./OwnerExample.sol");
module.exports = function (deployer) {
        deployer.deploy(Example);
        deployer.deploy(OwnerExample);
};
