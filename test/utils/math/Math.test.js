const MathMock = artifacts.require('./mocks/MathMock.sol');
const { expect, BN, expectRevert, constants  } = require('@cpchain-tools/dapps-test-helpers');
const { MAX_UINT256 } = constants;

contract("MathMock", () => {
  const min = new BN('1234');
  const max = new BN('5678');
  let instance = null

  beforeEach(async ()=> {
    instance = await MathMock.new()
    assert.ok(instance)
  })

  // Max
  it('is correctly detected in first argument position', async function () {
    expect(await instance.max(max, min)).to.be.bignumber.equal(max);
  });

  it('is correctly detected in second argument position', async function () {
    expect(await instance.max(min, max)).to.be.bignumber.equal(max);
  });

  // Min
  it('is correctly detected in first argument position', async function () {
    expect(await instance.min(min, max)).to.be.bignumber.equal(min);
  });

  it('is correctly detected in second argument position', async function () {
    expect(await instance.min(max, min)).to.be.bignumber.equal(min);
  });

  // Avg
  function bnAverage (a, b) {
    return a.add(b).divn(2);
  }

  it('is correctly calculated with two odd numbers', async function () {
    const a = new BN('57417');
    const b = new BN('95431');
    expect(await instance.average(a, b)).to.be.bignumber.equal(bnAverage(a, b));
  });

  it('is correctly calculated with two even numbers', async function () {
    const a = new BN('42304');
    const b = new BN('84346');
    expect(await instance.average(a, b)).to.be.bignumber.equal(bnAverage(a, b));
  });

  it('is correctly calculated with one even and one odd number', async function () {
    const a = new BN('57417');
    const b = new BN('84346');
    expect(await instance.average(a, b)).to.be.bignumber.equal(bnAverage(a, b));
  });

})
