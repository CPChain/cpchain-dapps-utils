// Deploy Example
var Example = artifacts.require("./Example.sol");
var OwnerExample = artifacts.require("./OwnerExample.sol");
module.exports = function (deployer) {
        deployer.deploy(Example); //"参数在第二个变量携带"
        deployer.deploy(OwnerExample); //"参数在第二个变量携带"
};
