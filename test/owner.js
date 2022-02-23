const Example = artifacts.require("Example");
const truffleAssert = require('truffle-assertions');

contract("Test Owner contract", (accounts) => {
    it("owner should be:" + accounts[0], async () => {
        const instance = await Example.deployed()
        const owner = await instance.owner()
        assert.equal(owner, accounts[0])
    })

    it("should greet from user", async () => {
        const instance = await Example.deployed()
        const message = await instance.greet()
        assert.equal(message, 'User')
    })

    it("should greet from user", async () => {
        const instance = await Example.deployed()
        const message = await instance.greet({ from: accounts[1] })
        assert.equal(message, 'User')
    })

    it("should greet from owner", async () => {
        const instance = await Example.deployed()
        const message = await instance.ownerGreet()
        assert.equal(message, 'Owner')
    })


    it(`should greet failed for ${accounts[1]} because it is not owner`, async () => {
        try {
            const instance = await Example.deployed()
            await instance.ownerGreet({ from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    }) 

    it("should set reserve owner to:" + accounts[1], async () => {
        const instance = await Example.deployed()
        const result = await instance.transferOwnership(accounts[1])

        truffleAssert.eventEmitted(result, 'ReserveOwnerSetted', (ev) => {
            return ev.owner === accounts[0] && ev.reserveOwner === accounts[1]
        });

        const owner = await instance.owner()
        assert.equal(owner, accounts[0])
        const reserveOwner = await instance.reserveOwner()
        assert.equal(reserveOwner, accounts[1])
    })

    it(`should change owner failed for ${accounts[1]} because resvere owner do not claim ownership`, async () => {
        try {
            const instance = await Example.deployed()
            await instance.transferOwnership(accounts[2], { from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })

    it(`should claim ownership failed for ${accounts[2]} because it is not resvere owner `, async () => {
        try {
            const instance = await Example.deployed()
            await instance.claimOwnership({ from: accounts[2] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })


    it("should claim ownership success for:" + accounts[1], async () => {
        const instance = await Example.deployed()
        const result = await instance.claimOwnership({ from: accounts[1] })

        truffleAssert.eventEmitted(result, 'OwnershipTransferred', (ev) => {
            return ev.previousOwner === accounts[0] && ev.newOwner === accounts[1]
        });

        const owner = await instance.owner()
        assert.equal(owner, accounts[1])
    })

})
