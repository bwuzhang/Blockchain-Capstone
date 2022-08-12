const { assert } = require("chai");

var ERC721MintableComplete = artifacts.require("ERC721MintableComplete");

contract("TestERC721Mintable", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  let contractInstance;
  describe("match erc721 spec", function () {
    beforeEach(async function () {
      contractInstance = await ERC721MintableComplete.new({
        from: account_one,
      });

      // TODO: mint multiple tokens
      for (let i = 1; i <= 5; i++) {
        result = await contractInstance.mint(account_one, i, {
          from: account_one,
        });
      }
    });

    it("should return total supply", async function () {
      let result = await contractInstance.totalSupply.call({
        from: account_one,
      });
      assert.equal(result, 5, "Totaly supply is off!");
    });
    it("should get token balance", async function () {
      let result = await contractInstance.balanceOf(account_one);
      assert.equal(result, 5, "Balance is off!");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let result = await contractInstance.tokenURI(1);
      assert(
        result,
        "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
        "TokenURI is off!"
      );
    });

    it("should transfer token from one owner to another", async function () {
      await contractInstance.transferFrom(account_one, account_two, 1);
      let result = await contractInstance.ownerOf(1);
      assert.equal(result, account_two, "Transfer failed!");
    });
  });

  describe("have ownership properties", function () {
    let contractInstance;
    beforeEach(async function () {
      contractInstance = await ERC721MintableComplete.new({
        from: account_one,
      });
    });

    it("should fail when minting when address is not contract owner", async function () {
      let result = false;
      try {
        await contractInstance.mint(account_one, i, {
          from: account_two,
        });
        result = true;
      } catch (error) {}

      assert.equal(result, false, "Only owner can mint!");
    });

    it("should return contract owner", async function () {
      let result = await contractInstance.owner();
      assert(result, account_one, "Contract owner is wrong!");
    });
  });
});
