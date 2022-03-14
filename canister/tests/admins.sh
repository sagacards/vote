# #!/bin/bash

# . ./tests/utils.sh

# bold "| Starting replica..."
# dfx start --background --clean > /dev/null 2>&1

# dfx identity new user > /dev/null 2>&1
# dfx identity use user > /dev/null 2>&1
# userPrincipal=$(dfx identity get-principal)

# dfx identity new admin > /dev/null 2>&1
# dfx identity use admin > /dev/null 2>&1
# adminPrincipal=$(dfx identity get-principal)

# dfx deploy --no-wallet

# # Users can't access admin functions

# dfx identity use user

# equal $(dfx canister call vote createProposal "(\"\", variant { \"Principal\" }, 0)") "(variant { err = variant { Unauthorized } })"
# equal $(dfx canister call vote updateProposal "(0, null, null)") "(variant { err = variant { Unauthorized } })"

# dfx identity use admin

# equal $(dfx canister call vote createProposal "(\"\", variant { \"Principal\" }, 0)") "()"
# equal $(dfx canister call vote updateProposal "(0, null, null)") "()"
