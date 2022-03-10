const SafeMathMock = artifacts.require('./mocks/SafeMathMock.sol');
const { expect, BN  } = require('@cpchain-tools/dapps-test-helpers');

contract("SafeMathMock", () => {
  let instance = null

  async function testCommutative(fn, lhs, rhs, expected) {
    expect(await fn(lhs, rhs)).to.be.bignumber.equal(expected);
    expect(await fn(rhs, lhs)).to.be.bignumber.equal(expected);
  }

  beforeEach(async ()=> {
    instance = await SafeMathMock.new()
    assert.ok(instance)
  })
  
  it('adds correctly', async function () {
    const a = new BN('5678');
    const b = new BN('1234');

    await testCommutative(instance.add, a, b, a.add(b));
  });
})
