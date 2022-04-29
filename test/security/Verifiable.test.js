const VerifiableMock = artifacts.require("./mocks/VerifiableMock.sol");
const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");
const b1 = Buffer.alloc(32);
const b2 = Buffer.alloc(32);
const b3 = Buffer.alloc(32);
b1.write("proof");
b2.write("content");
b3.write("proof2");
const proof = b1.toString('hex')
const proof2 = b3.toString('hex')
const content = b2.toString('hex')
const card = web3.utils.sha3('0x' + proof + content, { encoding: "hex" })
contract("Test VerifiableMock  ", () => {
  let instance;
  beforeEach(async () => {
    instance = await VerifiableMock.new();
    assert.ok(instance);
  });
  it("should open card success", async () => {
    try {
      const r = await instance.setProof(card, '0x' + proof, '0x' + content)
      truffleAssert.eventEmitted(r, 'ContentVerified', (ev) => {
        return web3.utils.toHex(ev[0]) == card &&
          web3.utils.toHex(ev[1]) == '0x' + proof &&
          web3.utils.toHex(ev[2]) == '0x' + content
      });
      assert.ok(r == true)
    } catch (error) {
      console.log(error)
    }
  })

  it("should open card failed", async () => {
    try {
      const r = await instance.setProof(card, '0x' + proof2, '0x' + content)

      assert.fail()
    } catch (error) {
      assert.ok(error.toString().includes('wrong proof or content'))
    }
  }) 
});
