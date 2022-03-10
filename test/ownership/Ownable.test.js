const OwnableMock = artifacts.require("./mocks/OwnableMock.sol");
const truffleAssert = require("truffle-assertions");

contract("Test Owner contract", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await OwnableMock.new();
    assert.ok(instance);
  });

  it("owner should be:" + accounts[0], async () => {
    const owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });

  it("should greet from user", async () => {
    const message = await instance.greet();
    assert.equal(message, "User");
  });

  it("should greet from user", async () => {
    const message = await instance.greet({ from: accounts[1] });
    assert.equal(message, "User");
  });

  it("should greet from owner", async () => {
    const message = await instance.ownerGreet();
    assert.equal(message, "Owner");
  });

  it(`should greet failed for ${accounts[1]} because it is not owner`, async () => {
    try {
      await instance.ownerGreet({ from: accounts[1] });
    } catch (error) {
      assert.ok(error.toString());
    }
  });

  it("should set change owner to:" + accounts[1], async () => {
    const result = await instance.transferOwnership(accounts[1]);
    truffleAssert.eventEmitted(result, "OwnershipTransferred", (ev) => {
      return ev.previousOwner === accounts[0] && ev.newOwner === accounts[1];
    });
    const owner = await instance.owner();
    assert.equal(owner, accounts[1]);
  });
});
