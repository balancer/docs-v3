---
title: Token Whitelisting
order: 2
---

# Token Whitelisting

This guide explains the process of whitelisting tokens on Balancer and important security considerations.

## Security Advisory

::: danger Important Security Note
Due to a known vulnerability in Balancer V2's Vault (discovered March 2023), new tokens require careful verification before being added to pools. While this vulnerability doesn't affect existing tokens or funds in the V2 Vault, it's important to follow the proper whitelisting process for new tokens.

The vulnerability only potentially affects token addresses that:
- Are not currently live on-chain
- Would eventually be deposited in the Balancer V2 Vault

For full details, see the [vulnerability disclosure](https://forum.balancer.fi/t/balancer-v2-token-frontrun-vulnerability-disclosure/6309).
:::

## Whitelisting Process

To whitelist your token on Balancer, you need to submit a Pull Request to the [Balancer tokenlists repository](https://github.com/balancer/tokenlists). This process ensures your token is properly verified and can be traded on our platform.

### Requirements

1. Token contract must be verified on Etherscan (or equivalent explorer for other networks)
2. Token must be already deployed and live on-chain
3. Token must have no transfer restrictions or rebasing mechanics that could interfere with pool operations

### Steps

1. Prepare Token Images
    - Provide PNG files of your token logo
    - Name the file using your token contract address: `0xTOKENADDRESS.png`

2. Update Tokenlist Files
    - Add your token to `tokenlists/balancer/tokens`
    - Update the corresponding network typescript file
    - Example: `tokenlists/balancer/tokens/arbitrum/0x...`

3. Submit Pull Request
    - Create a PR with your changes
    - Include relevant token information and documentation
    - Wait for review from the Balancer team

## Post-Whitelisting

After your token is whitelisted:
- It will appear in the Balancer interface
- Users can trade it through the frontend
- You can create pools including the token

::: warning Note
For new projects looking to integrate with Balancer, we recommend using Balancer V3 which is not affected by the V2 vulnerability.
:::

## Additional Resources

1. [Balancer Tokenlists Repository](https://github.com/balancer/tokenlists)
2. [Token Requirements Documentation](../../concepts/vault/token-types.md)
3. [V2 Vulnerability Disclosure](https://forum.balancer.fi/t/balancer-v2-token-frontrun-vulnerability-disclosure/6309)
