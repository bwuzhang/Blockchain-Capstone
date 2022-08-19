import SolnSquareVerifier from "./eth-contracts/build/SolnSquareVerifier.json";

const Web3 = require("web3");
const rpcURL = "https://rinkeby.infura.io/v3/fc4da3a0b59c47a486688dcdea2d5a11";
const web3 = new Web3(rpcURL);
const account_one = "0x3ec7a486e12BFBb97646904aB569B20d0709BC41";

const networkId = await web3.eth.net.getId();
const deployedNetwork = CollateralPostingContract.networks[networkId];
const instance = new web3.eth.Contract(
  SolnSquareVerifier.abi,
  deployedNetwork && deployedNetwork.address
);
