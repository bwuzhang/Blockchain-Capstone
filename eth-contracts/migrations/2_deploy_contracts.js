// migrating the appropriate contracts
// var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
var ERC721Mintable = artifacts.require("ERC721MintableComplete");
var SquareVerifier = artifacts.require("verifier");

module.exports = function (deployer) {
  deployer.deploy(ERC721Mintable);
  deployer.deploy(SquareVerifier);
  // deployer.deploy(SolnSquareVerifier);
};
