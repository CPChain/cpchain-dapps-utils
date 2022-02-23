// Deploy Example
var Example = artifacts.require("./Example.sol");

module.exports = function(deployer) {
        deployer.deploy(Example); //"参数在第二个变量携带"
};
