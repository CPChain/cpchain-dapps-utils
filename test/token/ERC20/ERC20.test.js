const ERC20Mock = artifacts.require('./mocks/ERC20Mock.sol');

const { BN, constants, expectEvent, expectRevert } = require('@cpchain-tools/dapps-test-helpers');
const { expect } = require('chai');
const { ZERO_ADDRESS } = constants;

const {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Transfer,
  shouldBehaveLikeERC20Approve,
} = require('./ERC20.behavior');

contract("ERC20Mock", (accounts) => {
  const [ initialHolder, recipient, anotherAccount ] = accounts;

  const initialSupply = new BN(100);

  let token = null

  beforeEach(async function () {
    token = await ERC20Mock.new(initialHolder, initialSupply);
  });

  it('Should behave like ERC20', () => {
    shouldBehaveLikeERC20(token, 'ERC20', initialSupply, initialHolder, recipient, anotherAccount);
  })

  it('decrease allowance', async () => {
    describe('when the spender is not the zero address', function () {
      const spender = recipient;

      function shouldDecreaseApproval (amount) {
        describe('when there was no approved amount before', function () {
          it('reverts', async function () {
            await expectRevert(token.decreaseAllowance(
              spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero'
            );
          });
        });

        describe('when the spender had an approved amount', function () {
          const approvedAmount = amount;

          beforeEach(async function () {
            ({ logs: this.logs } = await token.approve(spender, approvedAmount, { from: initialHolder }));
          });

          it('emits an approval event', async function () {
            const { logs } = await token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });

            expectEvent.inLogs(logs, 'Approval', {
              owner: initialHolder,
              spender: spender,
              value: new BN(0),
            });
          });

          it('decreases the spender allowance subtracting the requested amount', async function () {
            await token.decreaseAllowance(spender, approvedAmount.subn(1), { from: initialHolder });

            expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal('1');
          });

          it('sets the allowance to zero when all allowance is removed', async function () {
            await token.decreaseAllowance(spender, approvedAmount, { from: initialHolder });
            expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
          });

          it('reverts when more than the full allowance is removed', async function () {
            await expectRevert(
              token.decreaseAllowance(spender, approvedAmount.addn(1), { from: initialHolder }),
              'ERC20: decreased allowance below zero'
            );
          });
        });
      }

      describe('when the sender has enough balance', function () {
        const amount = initialSupply;

        shouldDecreaseApproval(amount);
      });

      describe('when the sender does not have enough balance', function () {
        const amount = initialSupply.addn(1);

        shouldDecreaseApproval(amount);
      });
    });

    describe('when the spender is the zero address', function () {
      const amount = initialSupply;
      const spender = ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevert(token.decreaseAllowance(
          spender, amount, { from: initialHolder }), 'ERC20: decreased allowance below zero'
        );
      });
    });
  });

  describe('increase allowance', async () => {
    const amount = initialSupply;
    const spender = recipient;

    it('emits an approval event', async function () {
      // await token.approve(spender, amount, { from: initialHolder });
      expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
      const { logs } = await token.increaseAllowance(spender, amount, { from: initialHolder });

      expectEvent.inLogs(logs, 'Approval', {
        owner: initialHolder,
        spender: spender,
        value: amount,
      });
    });

    it('approves the requested amount', async function () {
      await token.increaseAllowance(spender, amount, { from: initialHolder });
      expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
    });

    it('increases the spender allowance adding the requested amount', async function () {
      await token.approve(spender, new BN(1), { from: initialHolder });
      await token.increaseAllowance(spender, amount, { from: initialHolder });
      expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
    });

    it('emits an approval event', async function () {
      const amount = initialSupply.addn(1);
      const { logs } = await token.increaseAllowance(spender, amount, { from: initialHolder });

      expectEvent.inLogs(logs, 'Approval', {
        owner: initialHolder,
        spender: spender,
        value: amount,
      });
    });

    it('approves the requested amount', async function () {
      const amount = initialSupply.addn(1);
      await token.increaseAllowance(spender, amount, { from: initialHolder });
      expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount);
    });

    it('increases the spender allowance adding the requested amount', async function () {
      await token.approve(spender, new BN(1), { from: initialHolder });
      await token.increaseAllowance(spender, amount, { from: initialHolder });
      expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal(amount.addn(1));
    });

    it('when the spender is the zero address: reverts', async ()=> {
      const spender = ZERO_ADDRESS;
      await expectRevert(
        token.increaseAllowance(spender, amount, { from: initialHolder }), 'ERC20: approve to the zero address'
      );
    });
  });

  describe('_mint', async () => {
    const amount = new BN(50);
    it('rejects a null account', async function () {
      await expectRevert(
        token.mint(ZERO_ADDRESS, amount), 'ERC20: mint to the zero address'
      );
    });

    it("mint 50 CPC", async ()=> {
      // mint 50 CPC
      const { logs } = await token.mint(recipient, amount);

      // increments totalSupply
      const expectedSupply = initialSupply.add(amount);
      expect(await token.totalSupply()).to.be.bignumber.equal(expectedSupply);

      // increments recipient balance
      expect(await token.balanceOf(recipient)).to.be.bignumber.equal(amount);

      // emits Transfer event
      const event = expectEvent.inLogs(logs, 'Transfer', {
        from: ZERO_ADDRESS,
        to: recipient,
      });

      expect(event.args.value).to.be.bignumber.equal(amount);
    })
  });

  function describeBurn(desc, amount) {
    it(desc, async ()=> {
      const { logs } = await token.burn(initialHolder, amount);

      // decrements totalSupply
      expect(await token.totalSupply()).to.be.bignumber.equal(initialSupply.sub(amount));

      // decrements initialHolder balance
      expect(await token.balanceOf(initialHolder)).to.be.bignumber.equal(initialSupply.sub(amount));

      // emits Transfer event
      const event = expectEvent.inLogs(logs, 'Transfer', {
        from: initialHolder,
        to: ZERO_ADDRESS,
        value: amount
      });

      expect(event.args.value).to.be.bignumber.equal(amount);
    })
  }

  describe('_burn', async () => {
    it('rejects a null account', async function () {
      await expectRevert(token.burn(ZERO_ADDRESS, new BN(1)),
        'ERC20: burn from the zero address');
    });
    it('rejects burning more than balance', async function () {
      await expectRevert(token.burn(
        initialHolder, initialSupply.addn(1)), 'ERC20: burn amount exceeds balance'
      );
    });

    describeBurn('for entire balance', initialSupply);
    describeBurn('for less amount than balance', initialSupply.subn(1));
  });

  // it('_burnFrom', function () {
  //   const allowance = new BN(70);

  //   const spender = anotherAccount;

  //   beforeEach('approving', async function () {
  //     await token.approve(spender, allowance, { from: initialHolder });
  //   });

  //   it('rejects a null account', async function () {
  //     await expectRevert(token.burnFrom(ZERO_ADDRESS, new BN(1)),
  //       'ERC20: burn from the zero address'
  //     );
  //   });

  //   describe('for a non zero account', function () {
  //     it('rejects burning more than allowance', async function () {
  //       await expectRevert(token.burnFrom(initialHolder, allowance.addn(1)),
  //         'ERC20: burn amount exceeds allowance'
  //       );
  //     });

  //     it('rejects burning more than balance', async function () {
  //       await expectRevert(token.burnFrom(initialHolder, initialSupply.addn(1)),
  //         'ERC20: burn amount exceeds balance'
  //       );
  //     });

  //     const describeBurnFrom = function (description, amount) {
  //       describe(description, function () {
  //         beforeEach('burning', async function () {
  //           const { logs } = await token.burnFrom(initialHolder, amount, { from: spender });
  //           this.logs = logs;
  //         });

  //         it('decrements totalSupply', async function () {
  //           const expectedSupply = initialSupply.sub(amount);
  //           expect(await token.totalSupply()).to.be.bignumber.equal(expectedSupply);
  //         });

  //         it('decrements initialHolder balance', async function () {
  //           const expectedBalance = initialSupply.sub(amount);
  //           expect(await token.balanceOf(initialHolder)).to.be.bignumber.equal(expectedBalance);
  //         });

  //         it('decrements spender allowance', async function () {
  //           const expectedAllowance = allowance.sub(amount);
  //           expect(await token.allowance(initialHolder, spender)).to.be.bignumber.equal(expectedAllowance);
  //         });

  //         it('emits a Transfer event', async function () {
  //           const event = expectEvent.inLogs(this.logs, 'Transfer', {
  //             from: initialHolder,
  //             to: ZERO_ADDRESS,
  //           });

  //           expect(event.args.value).to.be.bignumber.equal(amount);
  //         });

  //         it('emits an Approval event', async function () {
  //           expectEvent.inLogs(this.logs, 'Approval', {
  //             owner: initialHolder,
  //             spender: spender,
  //             value: await token.allowance(initialHolder, spender),
  //           });
  //         });
  //       });
  //     };

  //     describeBurnFrom('for entire allowance', allowance);
  //     describeBurnFrom('for less amount than allowance', allowance.subn(1));
  //   });
  // });

  // it('_transfer', async () => {
  //   console.log('------->>>>>>>0', (await token.balanceOf(initialHolder)).toString())
  //   shouldBehaveLikeERC20Transfer(token, 'ERC20', initialHolder, recipient, initialSupply, function (from, to, amount) {
  //     token.balanceOf(from).then(r => {
  //       console.log('----->>>>>1', r.toString())
  //     })
  //     token.balanceOf(to).then(r => {
  //       console.log('----->>>>>2', r.toString())
  //     })
  //     return token.transferInternal(from, to, amount);
  //   });

  //   describe('when the sender is the zero address', function () {
  //     it('reverts', async function () {
  //       await expectRevert(token.transferInternal(ZERO_ADDRESS, recipient, initialSupply),
  //         'ERC20: transfer from the zero address'
  //       );
  //     });
  //   });
  // });
  
    // describe('_approve', function () {
    //   shouldBehaveLikeERC20Approve(token, 'ERC20', initialHolder, recipient, initialSupply, function (owner, spender, amount) {
    //     return token.approveInternal(owner, spender, amount);
    //   });
  
    //   describe('when the owner is the zero address', function () {
    //     it('reverts', async function () {
    //       await expectRevert(token.approveInternal(ZERO_ADDRESS, recipient, initialSupply),
    //         'ERC20: approve from the zero address'
    //       );
    //     });
    //   });
    // });
});
