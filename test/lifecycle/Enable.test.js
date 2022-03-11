const EnableMock = artifacts.require("./mocks/EnableMock.sol");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("Test enable", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await EnableMock.new();
    assert.ok(instance);
  });

  it("contract enabled should be true ", async () => {
    const enabled = await instance.enabled();
    assert.equal(enabled, true);
  });

  it("should greet from user", async () => {
    const message = await instance.greet();
    assert.equal(message, "User");
  });

  it("contract disabled by admin", async () => {
    const result = await instance.disableContract();
    const enabled = await instance.enabled();
    assert.equal(enabled, false);

    truffleAssert.eventEmitted(result, "EnableStatusChanged", (ev) => {
      return ev.enabled === false;
    });
  });

  it(`should greet failed for ${accounts[1]} because contract is disabled`, async () => {
    await instance.disableContract();
    try {
      await instance.greet({ from: accounts[1] });
      assert.fail()
    } catch (error) {
      assert.ok(error.toString().includes('Contract has been disabled by owner'));
    }
  });

  it("contract enabled by admin", async () => {
    const result = await instance.enableContract();
    const enabled = await instance.enabled();
    assert.equal(enabled, true);
    truffleAssert.eventEmitted(result, "EnableStatusChanged", (ev) => {
      return ev.enabled === true;
    });
  });

  it("should greet from user", async () => {
    const message = await instance.greet();
    assert.equal(message, "User");
  });
});
