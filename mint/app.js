import SolnSquareVerifier from "../eth-contracts/build/contracts/SolnSquareVerifier.json" assert { type: "json" };
import Web3 from "web3";
import fs from "fs";
let secrets;

if (fs.existsSync("../eth-contracts/secrets.json")) {
  secrets = JSON.parse(
    fs.readFileSync("../eth-contracts/secrets.json", "utf8")
  );
}
const rpcURL = "https://rinkeby.infura.io/v3/" + secrets.infuraApiKey;
const web3 = new Web3(rpcURL);
const account_one = secrets.account;

const networkId = await web3.eth.net.getId();
const deployedNetwork = SolnSquareVerifier.networks[networkId];
const instance = new web3.eth.Contract(
  SolnSquareVerifier.abi,
  deployedNetwork && deployedNetwork.address
);
import proofFromFile from "../zokrates/code/square/proof.json" assert { type: "json" };

async function main() {
  let proofAsUint = getProofAsUint();
  const nonce = await web3.eth.getTransactionCount(account_one, "latest"); // nonce starts counting from 0

  const transactions = [
    {
      from: account_one,
      to: deployedNetwork.address,
      value: 0,
      gas: 1500000,
      maxFeePerGas: 10000108,
      nonce: nonce,
      data: instance.methods
        .addSolution(proofAsUint.proof, proofAsUint.inputs)
        .encodeABI(),
    },
    {
      from: account_one,
      to: deployedNetwork.address,
      value: 0,
      gas: 1500000,
      maxFeePerGas: 10000108,
      nonce: nonce + 1,
      data: instance.methods
        .verifiedMint(12, proofAsUint.proof, proofAsUint.inputs)
        .encodeABI(),
    },
  ];
  let i = 0;
  while (i < 2) {
    const signedTx = await web3.eth.accounts.signTransaction(
      transactions[i],
      secrets.privateKey
    );
    web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        if (!error) {
          console.log(
            "🎉 The hash of your transaction is: ",
            hash,
            "\n Check Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log(
            "❗Something went wrong while submitting your transaction:",
            error
          );
        }
      }
    );
    i++;
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait 20 seconds for the next block
  }
}

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
main();
