zokrates compile -i square.code
zokrates setup
zokrates compute-witness -a 10 2 79 158
zokrates generate-proof
zokrates export-verifier
zokrates verify
cp verifier.sol ../../../eth-contracts/contracts/