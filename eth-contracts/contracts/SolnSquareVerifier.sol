pragma solidity >=0.4.21 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721Mintable.sol";
import "./verifier.sol";
// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// contract Verifier {
//         function verifyTx(
//             Proof memory proof, uint[1] memory input
//         ) public view returns (bool r);
// }


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {

    Verifier private verifier;
    constructor (address verifierAddress) ERC721MintableComplete() 
        public
    {
        verifier = Verifier(verifierAddress);
    }
    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address provider;
        bool minted;
    }

    // TODO define an array of the above struct
    Solution[] solutions;
    uint256 public solutionCounter = 0;
    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions_mapping;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address provider);


    // TODO Create a function to add the solutions to the arr
    function addSolution(Verifier.Proof memory proof, uint[1] memory input) public returns(bool){
        bytes32 solutionHash = keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X[0], proof.b.X[1], proof.b.Y[0], proof.b.Y[1], proof.c.X, proof.c.Y, input[0]));
        require(solutions_mapping[solutionHash].provider == address(0), "Solution already exists!");

        bool verificationResult = verifier.verifyTx(proof, input);
        if (!verificationResult){
            return false;
        } 
        else{
            solutions_mapping[solutionHash].provider = msg.sender;
            solutions_mapping[solutionHash].index = solutionCounter;
            emit SolutionAdded(solutionCounter, msg.sender);
            solutionCounter += 1;
            return true;
        }
    }


    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    function verifiedMint(uint256 index, Verifier.Proof memory proof, uint[1] memory input) public {
        bytes32 solutionHash = keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X[0], proof.b.X[1], proof.b.Y[0], proof.b.Y[1], proof.c.X, proof.c.Y, input[0]));
        require(solutions_mapping[solutionHash].provider != address(0), "Solution needs to exist!");
        require(solutions_mapping[solutionHash].provider == msg.sender, "Solution provided and NFT minter are not the same address!");
        require(solutions_mapping[solutionHash].minted == false, "Solution is used!");

        super.mint(msg.sender, index);
        solutions_mapping[solutionHash].minted == true;
    }

    function getSolutionProvider(Verifier.Proof memory proof, uint[1] memory input) view public returns(address){
        bytes32 solutionHash = keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X[0], proof.b.X[1], proof.b.Y[0], proof.b.Y[1], proof.c.X, proof.c.Y, input[0]));
        require(solutions_mapping[solutionHash].provider != address(0), "Solution needs to exist!");
        return(solutions_mapping[solutionHash].provider);
    }

}



  


























