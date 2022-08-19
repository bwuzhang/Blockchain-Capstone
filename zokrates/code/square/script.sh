zokrates compile -i square.code
zokrates setup
zokrates compute-witness -a 11 121
zokrates generate-proof
zokrates export-verifier
zokrates verify
# cp verifier.sol ../../../eth-contracts/contracts/