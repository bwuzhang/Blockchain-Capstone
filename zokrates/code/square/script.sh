# zokrates compile -i square.code
# zokrates setup
zokrates compute-witness -a 12 144
zokrates generate-proof
# zokrates export-verifier
zokrates verify
# cp verifier.sol ../../../eth-contracts/contracts/