const Example = artifacts.require("Example");
const truffleAssert = require('truffle-assertions');
contract("Test enable", (accounts) => {
    it("contract enabled should be true ", async () => {
        const instance = await Example.deployed()
        const enabled = await instance.enabled()
        assert.equal(enabled, true)
    })

    
    it("should greet from user", async () => {
        const instance = await Example.deployed()
        const message = await instance.greet()
        assert.equal(message, 'User')
    }) 


    it("contract disabled by admin", async () => {
        const instance = await Example.deployed()
        const result = await instance.disableContract()
        const enabled = await instance.enabled()
        assert.equal(enabled, false)

        truffleAssert.eventEmitted(result, 'EnableStatusChanged', (ev) => {
            return ev.enabled === false
        });
    })

    it(`should greet failed for ${accounts[1]} because contract is disabled`, async () => {
        try {
            const instance = await Example.deployed()
            await instance.greet({ from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    }) 


    it("contract enabled by admin", async () => {
        const instance = await Example.deployed()
        const result = await instance.enableContract()
        const enabled = await instance.enabled()
        assert.equal(enabled, true)
        truffleAssert.eventEmitted(result, 'EnableStatusChanged', (ev) => {
            return ev.enabled === true
        });
    })

    it("should greet from user", async () => {
        const instance = await Example.deployed()
        const message = await instance.greet()
        assert.equal(message, 'User')
    }) 
  

})
