const { assert } = require("chai");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const proofFromFile = require("../../zokrates/code/square/proof.json");
var SquareVerifier = artifacts.require("verifier");

contract("TestSolnSquareVerifier", (accounts) => {
  const account_one = accounts[0];
  const account_two = accounts[1];
  let solutionInstance;
  let verifierInstance;
  describe("test square verifier specs", function () {
    beforeEach(async function () {
      verifierInstance = await SquareVerifier.new({
        from: account_one,
      });
      solutionInstance = await SolnSquareVerifier.new(
        verifierInstance.address,
        {
          from: account_one,
        }
      );
      proofAsUint = getProofAsUint();
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("should add a solution", async function () {
      await solutionInstance.addSolution(proofAsUint.proof, proofAsUint.inputs);
      let result = await solutionInstance.solutionCounter.call({
        from: account_one,
      });
      assert.equal(result.toNumber(), 1, "Solution added!");
    });

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it("should mint a token", async function () {
      await solutionInstance.addSolution(
        proofAsUint.proof,
        proofAsUint.inputs,
        { from: account_one }
      );

      await solutionInstance.verifiedMint(
        3231,
        proofAsUint.proof,
        proofAsUint.inputs,
        { from: account_one }
      );
      let owner = await solutionInstance.ownerOf(3231);
      assert.equal(owner, account_one, "Mint is successful!");
    });
  });
});

const getProofAsUint = () => {
  return {
    proof: {
      a: [
        web3.utils.toBN(proofFromFile.proof.a[0]).toString(),
        web3.utils.toBN(proofFromFile.proof.a[1]).toString(),
      ],
      b: [
        [
          web3.utils.toBN(proofFromFile.proof.b[0][0]).toString(),
          web3.utils.toBN(proofFromFile.proof.b[0][1]).toString(),
        ],
        [
          web3.utils.toBN(proofFromFile.proof.b[1][0]).toString(),
          web3.utils.toBN(proofFromFile.proof.b[1][1]).toString(),
        ],
      ],
      c: [
        web3.utils.toBN(proofFromFile.proof.c[0]).toString(),
        web3.utils.toBN(proofFromFile.proof.c[1]).toString(),
      ],
    },
    inputs: proofFromFile.inputs,
  };
};
