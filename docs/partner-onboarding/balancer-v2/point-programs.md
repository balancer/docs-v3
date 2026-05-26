---
title: Points Programs
order: 7
---

# Setting Up a Partner Points Program Tag on the Balancer UI

This guide will walk you through the process of setting up a tag for your partner points program in the Balancer protocol. By following these steps, you'll be able to tag sets of pools in the Balancer API and frontend, allowing users to earn points for providing liquidity to specific pools.

:::info
All information provided herein is referencing how to make changes to the [metadata repository](https://github.com/balancer/metadata/) to register a points program on the Balancer Zen UI.
:::

## Overview

To set up a partner points program tag, you'll need to:

1. Add a new tag to the `index.json` file
2. (Optional) Add a tag icon

## Step 1: Add a New Tag

First, you'll need to update the `index.json` file located at `metadata/pools/tag/index.json`. Add a new object to the JSON array with the following structure:

```json
{
  "id": "points_your_protocol_name",
  "name": "Points (Your Protocol Name)",
  "description": "Description of your points program",
  "value": "4", // Optional: Use if you have a points multiplier (e.g., "4" for 4x points)
  "url": "https://your-protocol-website.com",
  "icon": "points_your_protocol_name.svg", // Optional
  "pools": [
    "0x90e6cb5249f5e1572afbf8a96d8a1ca6acffd739000000000000000000000055c",
    "0x7761b6e0daa04e70637d81f1da7d186c205c2ade00000000000000000000065d",
    "0x73a7fe27fe9545d53924e529acf11f3073841b9e000000000000000000000133"
  ]
}
```

### Key Points:

- The `id` should start with "points_" followed by your protocol name (e.g., "points_kelp").
- Provide a clear, concise description of your points program.
- If your program has a points multiplier, include it in the `value` field (e.g., "4" for 4x points).
- The `pools` array should contain the IDs of all pools that are eligible for your points program.
- If you're adding an icon (Step 2), include the `icon` property.

## Step 2: (Optional) Add a Tag Icon

If you want to display an icon for your tag in the Balancer frontend:

1. Add your icon file (preferably in SVG, PNG, or JPG format) to the `/icons` directory.
2. Name the file using your tag ID (e.g., `points_your_protocol_name.svg`).
3. Ensure you've included the `icon` property in your tag object in `index.json`.

## Examples

Here are some examples of existing partner points program tags:

### Kelp DAO

```json
{
  "id": "points_kelp",
  "name": "Points (Kelp)",
  "description": "LPs earn Miles on the TVL of the pool. The Miles boost increases rewards based on the total pool capital, not just rsETH. Your daily Kelp Miles value is calculated by multiplying the effective rsETH balance by 10,000 times the boost value. Your Miles are then distributed based on your share of the liquidity pool.",
  "url": "https://kelpdao.xyz",
  "icon": "points_kelp.jpg",
  "pools": [
    "0x90e6cb5249f5e1572afbf8a96d8a1ca6acffd73900000000000000000000055c",
    "0x7761b6e0daa04e70637d81f1da7d186c205c2ade00000000000000000000065d",
    "0x73a7fe27fe9545d53924e529acf11f3073841b9e000000000000000000000133"
  ]
}
```

### YieldFi (with multiplier)

```json
{
  "id": "points_yieldfi",
  "name": "Points (YieldFi)",
  "description": "LPs in this pool earn 2x YieldCrumbs on the TVL provided to the pool (yUSD + aUSDC)",
  "value": "2x",
  "url": "https://yield.fi",
  "icon": "points_yieldfi.jpg",
  "pools": [
    "0x7abe8caa137cdb2490a9fa9f8be70cfbb0ff8652",
    "0x424d19d482a891b2c5cb881d651fbc32b349cb3c",
    "0x21f132ade35684b230af974b80b5bfd2678ebd80",
    "0xb6a9a815d98cb98fd9f2353ec59de07b63f5b485"
  ]
}
```

### Sonic Points Program (with higher multiplier)

```json
{
  "id": "points_sonic_12x",
  "name": "Sonic Points Program",
  "description": "Earn 12x Sonic Activity points for supplying USDC.e, scUSD or wstkscUSD. Receive a share of the 200M S airdrop!",
  "value": "12",
  "url": "https://blog.soniclabs.com/sonic-points-simplified-how-to-qualify-for-200-million-s-airdrop/",
  "icon": "sonic.svg",
  "pools": [
    "0x43026d483f42fb35efe03c20b251142d022783f2",
    "0xcd4d2b142235d5650ffa6a38787ed0b7d7a51c0c000000000000000000000037",
    "0x25ca5451cd5a50ab1d324b5e64f32c0799661891000200000000000000000018"
    // Additional pool IDs...
  ]
}
```

## Alternative Format: Using Tokens Instead of Pools

For some tags, you may want to specify tokens instead of pools. In this case, your tag object would look like:

```json
{
  "id": "points_rings",
  "name": "Rings Points Program",
  "description": "Earn Rings points and receive part of their Sonic Gems allocation.",
  "value": "1.5",
  "url": "https://app.rings.money/#/points",
  "icon": "rings.svg",
  "pools": [],
  "tokens": {
    "146": [
      "0xd3dce716f3ef535c5ff8d041c1a41c3bd89b97ae",
      "0x3bce5cb273f0f148010bbea2470e7b5df84c7812",
      "0x9fb76f7ce5fceaa2c42887ff441d46095e494206"
      // Additional token IDs...
    ]
  }
}
```

## Best Practices

1. **Clear Descriptions**: Provide a clear and concise description of your points program, including any special mechanics or multipliers.
2. **Unique Identifiers**: Ensure your tag ID is unique and descriptive, always starting with "points_" for points programs.
3. **Up-to-date Pool Lists**: Regularly update your pool list to reflect any changes in eligible pools.
4. **High-Quality Icons**: If providing an icon, ensure it's high-quality either in in .svg or .png format
5. **Appropriate Values**: If your program has a multiplier, clearly indicate it in the "value" field.

By following these steps and best practices, you'll successfully set up your partner points program tag in the Balancer protocol, allowing users to easily identify and participate in your program.
