---
title: Points Programs
order: 7
---

# Setting Up a Partner Points Program Category on the Balancer UI

This guide will walk you through the process of setting up a category for your partner points program in the Balancer protocol. By following these steps, you'll be able to tag sets of pools in the Balancer API and frontend, allowing users to earn points for providing liquidity to specific pools.
:::info
All information provided herein is referencing how to make changes to the [metadata repository ](https://github.com/balancer/metadata/) to register a points program on the Balancer Zen UI.
:::

## Overview

To set up a partner points program category, you'll need to:

1. Add a new category to the `index.json` file
2. Create a pool list file
3. (Optional) Add a category icon

## Step 1: Add a New Category

First, you'll need to update the `index.json` file located at `metadata/pools/categories/index.json`. Add a new object to the JSON array with the following structure:

```json
{
  "id": "points_your_protocol_name",
  "name": "Points (Your Protocol Name)",
  "description": "Description of your points program",
  "value": "X", // Optional: Use if you have a points multiplier
  "url": "https://your-protocol-website.com",
  "file": "points_your_protocol_name.json",
  "fileIcon": "points_your_protocol_name.jpg" // Optional
}
```

### Key Points:

- The `id` should start with "points_" followed by your protocol name (e.g., "points_kelp").
- Provide a clear, concise description of your points program.
- If your program has a points multiplier, include it in the `value` field (e.g., "4" for 4x points).
- The `file` should reference the JSON file you'll create in Step 2.
- If you're adding an icon (Step 3), include the `fileIcon` property.

## Step 2: Create a Pool List File

Create a new JSON file in the `metadata/pools/categories/` directory with the name you specified in the `file` property (e.g., `points_your_protocol_name.json`).

This file should contain an array of pool IDs that are eligible for your points program. For example:

```json
[
  "0x90e6cb5249f5e1572afbf8a96d8a1ca6acffd73900000000000000000000055c",
  "0x7761b6e0daa04e70637d81f1da7d186c205c2ade00000000000000000000065d",
  "0x73a7fe27fe9545d53924e529acf11f3073841b9e000000000000000000000133"
]
```

Ensure that each pool ID is valid and associated with your points program.

## Step 3: (Optional) Add a Category Icon

If you want to display an icon for your category in the Balancer frontend:

1. Add your icon file (preferably in SVG or JPG format) to the `/icons` directory.
2. Name the file using your category ID (e.g., `points_your_protocol_name.svg`).
3. Ensure you've included the `fileIcon` property in your category object in `index.json`.

## Examples

Here are some examples of existing partner points program categories:

### Kelp DAO

```json
{
  "id": "points_kelp",
  "name": "Points (Kelp)",
  "description": "LPs earn Miles on the TVL of the pool. The Miles boost increases rewards based on the total pool capital, not just rsETH. Your daily Kelp Miles value is calculated by multiplying the effective rsETH balance by 10,000 times the boost value. Your Miles are then distributed based on your share of the liquidity pool.",
  "url": "https://kelpdao.xyz",
  "file": "points_kelp.json",
  "fileIcon": "points_kelp.jpg"
}
```

### Renzo Protocol (with multiplier)

```json
{
  "id": "points_renzo_4x",
  "name": "Points (Renzo)",
  "description": "LPs in this pool earn 4x ezPoints on the TVL provided to the pool (wEth + ezEth)",
  "value": "4",
  "url": "https://www.app.renzoprotocol.com",
  "file": "points_renzo_4x.json",
  "fileIcon": "points_renzo.jpg"
}
```

## Best Practices

1. **Clear Descriptions**: Provide a clear and concise description of your points program, including any special mechanics or multipliers.
2. **Unique Identifiers**: Ensure your category ID is unique and descriptive.
3. **Up-to-date Pool Lists**: Regularly update your pool list file to reflect any changes in eligible pools.
4. **High-Quality Icons**: If providing an icon, ensure it's high-quality and properly sized for the Balancer frontend.

By following these steps and best practices, you'll successfully set up your partner points program category in the Balancer protocol, allowing users to easily identify and participate in your program.
