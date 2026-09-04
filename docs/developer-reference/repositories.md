---
title: Balancer Repositories
order: 5
---

# Balancer Repositories

The [Balancer GitHub organization](https://github.com/balancer) is the canonical directory of Balancer's public repositories. Rather than maintain a copy of that list here, this page explains the repository topics Balancer uses to classify its public repositories by type, lifecycle stage, and protocol generation, and links to filtered views of the organization's [repository list](https://github.com/orgs/balancer/repositories) for common combinations.

## Repository topics

Public repositories in the organization carry topics from the three groups below. Their values are visible to anyone viewing the repository list, and a query that names several topics returns only the repositories that carry all of them.

### Type

What the repository is for. Each repository carries one type topic.

| Topic | Meaning |
|-------|---------|
| `balancer-type-protocol` | Protocol or smart contract implementation |
| `balancer-type-frontend` | User-facing web application or interface |
| `balancer-type-backend` | Backend service or API |
| `balancer-type-sdk-library` | Reusable SDK or software library |
| `balancer-type-canonical-data` | Authoritative reference data such as configuration, addresses, or metadata |
| `balancer-type-data-indexing` | Indexing, subgraph, analytics, or data pipeline work |
| `balancer-type-ops-tooling` | Operational, governance, deployment, or administrative tooling |
| `balancer-type-docs` | Documentation |
| `balancer-type-template-example` | Starter, template, or example for developers to reuse or learn from |
| `balancer-type-research-test` | Simulation, research, testing, or experimental validation |
| `balancer-type-other` | Not well described by the more specific categories |

### Lifecycle

How actively the repository is developed. Each repository carries one lifecycle topic.

| Topic | Meaning |
|-------|---------|
| `balancer-lifecycle-active` | Under active development or operation |
| `balancer-lifecycle-maintenance` | Retained and supported, but not a primary development focus |
| `balancer-lifecycle-legacy` | Superseded or historical work that is still kept as a live repository |

### Generation

Which Balancer protocol generations the repository supports. Unlike type and lifecycle, generation can have more than one value: new development generally targets V3, but V2 remains operational, and many repositories support both V2 and V3, so they carry both topics. A repository that is not tied to any protocol generation carries the not-applicable topic instead.

| Topic | Meaning |
|-------|---------|
| `balancer-v1` | Supports Balancer V1 |
| `balancer-v2` | Supports Balancer V2 |
| `balancer-v3` | Supports Balancer V3 |
| `balancer-generation-not-applicable` | Not tied to a particular Balancer protocol generation |

## Filtered views

Each link below opens the organization's repository list filtered to one combination of topics. The query it uses is shown alongside, so you can adjust it in the filter box on that page.

| View | Query |
|------|-------|
| [V2 frontends](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-frontend+topic:balancer-v2+archived:false) | `topic:balancer-type-frontend topic:balancer-v2 archived:false` |
| [V3 frontends](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-frontend+topic:balancer-v3+archived:false) | `topic:balancer-type-frontend topic:balancer-v3 archived:false` |
| [Active V3 protocol repositories](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-protocol+topic:balancer-v3+topic:balancer-lifecycle-active+archived:false) | `topic:balancer-type-protocol topic:balancer-v3 topic:balancer-lifecycle-active archived:false` |
| [Active SDK and library repositories](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-sdk-library+topic:balancer-lifecycle-active+archived:false) | `topic:balancer-type-sdk-library topic:balancer-lifecycle-active archived:false` |
| [Templates and examples](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-template-example+archived:false) | `topic:balancer-type-template-example archived:false` |
| [Repositories supporting both V2 and V3](https://github.com/orgs/balancer/repositories?q=topic:balancer-v2+topic:balancer-v3+archived:false) | `topic:balancer-v2 topic:balancer-v3 archived:false` |
| [Active repositories that still support V2](https://github.com/orgs/balancer/repositories?q=topic:balancer-v2+topic:balancer-lifecycle-active+archived:false) | `topic:balancer-v2 topic:balancer-lifecycle-active archived:false` |
| [V3 data indexing](https://github.com/orgs/balancer/repositories?q=topic:balancer-type-data-indexing+topic:balancer-v3+archived:false) | `topic:balancer-type-data-indexing topic:balancer-v3 archived:false` |
| [Current repositories that still support V1](https://github.com/orgs/balancer/repositories?q=topic:balancer-v1+archived:false) | `topic:balancer-v1 archived:false` |
| [Not tied to a generation](https://github.com/orgs/balancer/repositories?q=topic:balancer-generation-not-applicable+archived:false) | `topic:balancer-generation-not-applicable archived:false` |

## Building your own filter

1. Open the organization's [repository list](https://github.com/orgs/balancer/repositories).
2. In the filter box, type one or more `topic:` qualifiers separated by spaces, for example `topic:balancer-type-sdk-library topic:balancer-v3`. A repository appears only if it carries every topic in the query.
3. Add `archived:false` to limit the results to current repositories.

::: info Archived repositories
GitHub's archived status is separate from the lifecycle topics. Archived repositories do not carry the classification topics, and the views above include `archived:false`, so they show current repositories only. Historical code, including the original V1 repositories, lives in archived repositories. To browse it, filter the repository list on `archived:true` and leave out the topic qualifiers.
:::
