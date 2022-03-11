const ClaimableMock = artifacts.require("./mocks/ClaimableMock.sol");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");

contract("Test Claim contract", (accounts) => {
  let instance;

  beforeEach(async () => {
    instance = await ClaimableMock.new();
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
      assert.fail()
    } catch (error) {
      assert.ok(error.toString().includes("Ownable: caller is not the owner"));
    }
  });

  it("should set reserve owner to:" + accounts[1], async () => {
    await instance.transferOwnership(accounts[1]);
    const owner = await instance.owner();
    assert.equal(owner, accounts[0]);
    const pendingOwner = await instance.pendingOwner();
    assert.equal(pendingOwner, accounts[1]);
  });

  it(`should change owner failed for ${accounts[1]} because resvere owner do not claim ownership`, async () => {
    try {
      await instance.transferOwnership(accounts[2], { from: accounts[1] });
      assert.fail()
    } catch (error) {
      assert.ok(error.toString("Ownable: caller is not the owner"));
    }
  });

  it(`should claim ownership failed for ${accounts[2]} because it is not resvere owner `, async () => {
    await instance.transferOwnership(accounts[1]);
    try {
      await instance.claimOwnership({ from: accounts[2] });
      assert.fail()
    } catch (error) {
      assert.ok(error.toString('Pending owner required'));
    }
  });

  it("should claim ownership success for:" + accounts[1], async () => {
    await instance.transferOwnership(accounts[1]);
    const result = await instance.claimOwnership({ from: accounts[1] });

    truffleAssert.eventEmitted(result, "OwnershipTransferred", (ev) => {
      return ev.previousOwner === accounts[0] && ev.newOwner === accounts[1];
    });

    const owner = await instance.owner();
    assert.equal(owner, accounts[1]);
  });
});
