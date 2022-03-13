const SafeMathMock = artifacts.require('./mocks/SafeMathMock.sol');
const { expect, BN, expectRevert, constants  } = require('@cpchain-tools/dapps-test-helpers');
const { MAX_UINT256 } = constants;

contract("SafeMathMock", () => {
  let instance = null

  async function testCommutative(fn, lhs, rhs, expected) {
    expect(await fn(lhs, rhs)).to.be.bignumber.equal(expected);
    expect(await fn(rhs, lhs)).to.be.bignumber.equal(expected);
  }

  async function testFailsCommutative (fn, lhs, rhs, reason) {
    await expectRevert(fn(lhs, rhs), reason);
    await expectRevert(fn(rhs, lhs), reason);
  }

  beforeEach(async ()=> {
    instance = await SafeMathMock.new()
    assert.ok(instance)
  })
  
  // add
  it('adds correctly', async function () {
    const a = new BN('5678');
    const b = new BN('1234');

    await testCommutative(instance.add, a, b, a.add(b));
  });

  it('reverts on addition overflow', async function () {
    const a = MAX_UINT256;
    const b = new BN('1');

    await testFailsCommutative(instance.add, a, b, 'SafeMath: addition overflow');
  });

  // sub
  it('subtracts correctly', async function () {
    const a = new BN('5678');
    const b = new BN('1234');

    expect(await instance.sub(a, b)).to.be.bignumber.equal(a.sub(b));
  });

  it('reverts if subtraction result would be negative', async function () {
    const a = new BN('1234');
    const b = new BN('5678');

    await expectRevert(instance.sub(a, b), 'SafeMath: subtraction overflow');
  });

  // mul
  it('multiplies correctly', async function () {
    const a = new BN('1234');
    const b = new BN('5678');

    await testCommutative(instance.mul, a, b, a.mul(b));
  });

  it('multiplies by zero correctly', async function () {
    const a = new BN('0');
    const b = new BN('5678');

    await testCommutative(instance.mul, a, b, '0');
  });

  it('reverts on multiplication overflow', async function () {
    const a = MAX_UINT256;
    const b = new BN('2');

    await testFailsCommutative(instance.mul, a, b, 'SafeMath: multiplication overflow');
  });

  // div
  it('divides correctly', async function () {
    const a = new BN('5678');
    const b = new BN('5678');

    expect(await instance.div(a, b)).to.be.bignumber.equal(a.div(b));
  });

  it('divides zero correctly', async function () {
    const a = new BN('0');
    const b = new BN('5678');

    expect(await instance.div(a, b)).to.be.bignumber.equal('0');
  });

  it('returns complete number result on non-even division', async function () {
    const a = new BN('7000');
    const b = new BN('5678');

    expect(await instance.div(a, b)).to.be.bignumber.equal('1');
  });

  it('reverts on division by zero', async function () {
    const a = new BN('5678');
    const b = new BN('0');

    await expectRevert(instance.div(a, b), 'SafeMath: division by zero');
  });

  // mod
  it('when the dividend is smaller than the divisor', async function () {
    const a = new BN('284');
    const b = new BN('5678');

    expect(await instance.mod(a, b)).to.be.bignumber.equal(a.mod(b));
  });

  it('when the dividend is equal to the divisor', async function () {
    const a = new BN('5678');
    const b = new BN('5678');

    expect(await instance.mod(a, b)).to.be.bignumber.equal(a.mod(b));
  });

  it('when the dividend is larger than the divisor', async function () {
    const a = new BN('7000');
    const b = new BN('5678');

    expect(await instance.mod(a, b)).to.be.bignumber.equal(a.mod(b));
  });

  it('when the dividend is a multiple of the divisor', async function () {
    const a = new BN('17034'); // 17034 == 5678 * 3
    const b = new BN('5678');

    expect(await instance.mod(a, b)).to.be.bignumber.equal(a.mod(b));
  });

  it('reverts with a 0 divisor', async function () {
    const a = new BN('5678');
    const b = new BN('0');

    await expectRevert(instance.mod(a, b), 'SafeMath: modulo by zero');
  });
})
