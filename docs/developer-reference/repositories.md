---
title: Balancer Repositories
order: 5
---

# Balancer Repositories

The [Balancer GitHub organization](https://github.com/balancer) is the canonical directory of Balancer's public repositories. Rather than maintain a copy of that list here, this page explains the custom properties Balancer uses to label public repositories by purpose, lifecycle stage, and protocol generation, and shows how to filter on them to find the repositories you need.

## Repository properties

Public repositories in the organization may carry the three custom properties below. Their values are visible to anyone viewing the repository list.

| Property | Value | Meaning |
|----------|-------|---------|
| `repo_type` | `protocol` | Protocol or smart contract implementation |
| `repo_type` | `frontend` | User-facing web application or interface |
| `repo_type` | `backend` | Backend service or API |
| `repo_type` | `sdk-library` | Reusable SDK or software library |
| `repo_type` | `canonical-data` | Authoritative reference data such as configuration, addresses, or metadata |
| `repo_type` | `data-indexing` | Indexing, subgraph, analytics, or data pipeline work |
| `repo_type` | `ops-tooling` | Operational, governance, deployment, or administrative tooling |
| `repo_type` | `docs` | Documentation |
| `repo_type` | `template-example` | Starter, template, or example for developers to reuse or learn from |
| `repo_type` | `research-test` | Simulation, research, testing, or experimental validation |
| `repo_type` | `other` | Not well described by the more specific categories |
| `lifecycle` | `active` | Under active development or operation |
| `lifecycle` | `maintenance` | Retained and supported, but not a primary development focus |
| `lifecycle` | `legacy` | Superseded or historical work that is still kept as a live repository |
| `generation` | `v1` | Primarily associated with Balancer V1 |
| `generation` | `v2` | Primarily associated with Balancer V2 |
| `generation` | `v3` | Primarily associated with Balancer V3 |
| `generation` | `multi` | Spans more than one Balancer generation |
| `generation` | `n-a` | Not tied to a particular Balancer generation |

## Finding repositories on GitHub

1. Open the [Balancer GitHub organization](https://github.com/balancer).
2. Select **Repositories**.
3. In the repository filter bar, type `prop` to pick a custom property from the list, or type a qualifier directly in the form `props.PROPERTY_NAME:VALUE`.
4. Add further qualifiers, separated by spaces, to narrow the results. A repository appears only if it matches every qualifier in the query.

## Example searches

| What you want | Filter |
|---------------|--------|
| V2 frontends | `props.generation:v2 props.repo_type:frontend` |
| Active V3 protocol repositories | `props.generation:v3 props.repo_type:protocol props.lifecycle:active` |
| SDK and library repositories in maintenance | `props.repo_type:sdk-library props.lifecycle:maintenance` |
| Templates and examples | `props.repo_type:template-example` |

::: info Archived repositories
GitHub's Archived status is separate from the `lifecycle` property. Archived repositories remain discoverable on GitHub through its standard repository filters. The property filters on this page are meant for finding Balancer's current public repositories.
:::
