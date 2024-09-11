---
title: User - Get pool balances
---

# Get pool balances for a user

As this is a CowAMM pool we also use the expanded `GqlPoolSwapEventCowAmm` type to get CowAMM specific swap data.

```
{
  userGetPoolBalances(
    address: "0x..."
    chains: [MAINNET]
  ) {
    totalBalance
    walletBalance
    stakedBalance
    poolId
    tokenAddress
    tokenPrice
  }
}
```