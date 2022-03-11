A canister for creating and collecting votes on proposals.

----

# Basic Example

**1. Deploy**

```sh
dfx start --clean --background
dfx deploy --no-wallet
```

**2. Create a Proposal**

A proposal has two parameters:

1. A title
2. A type that votes should use

```sh
dfx canister call vote createProposal '("Test Proposal", variant { "TextContent" })'
> (variant { ok })
```

**3. Set Voting Allocations**

You can determine who will be able to vote on this proposal, and how many votes they will have. Parameters:

1. Proposal ID
2. List of principals and their vote counts

```sh
dfx canister call vote createList "(0, vec { record { principal \"$(dfx identity get-principal)\"; 1 } })"
> (variant { ok })
```

**4. Vote!**

```sh
dfx canister call vote vote '(0, variant { "TextContent" = "My Vote!" })'
(variant { ok })
```

We allocated a single vote to our principal, so if we try to vote again we see:

```sh
(
  variant {
    err = variant {
      VoteMax = opt "You have issued the maximum number of votes."
    }
  },
)
```
