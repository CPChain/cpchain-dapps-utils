const { expect, use } = require('chai');
const { BN, expectRevert, constants, expectEvent } = require('@openzeppelin/test-helpers');

use(require('chai-bn')(BN))

module.exports = {
  expect,
  BN,
  expectRevert,
  constants,
  expectEvent
}
