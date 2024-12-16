<template>
  <div class="permissions-table">
    <div v-if="loading" class="loading">Loading permission table...</div>

    <div v-else-if="error" class="error">
      Error loading data. Please try again later.
    </div>

    <div v-else class="table-container">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="col-function">Function</th>
              <th class="col-contract">Contract</th>
              <th class="col-callers">Authorized Callers</th>
              <th class="col-deployments">Deployments</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortedTableData" :key="index">
              <td class="function">
                <pre><code class="javascript">{{ row.function }}</code></pre>
              </td>
              <td class="contract">{{ row.contract }}</td>
              <td class="callers">
                <template v-if="row.callerAddressesArray.length">
                  <ol>
                    <li
                      v-for="(address, idx) in row.callerAddressesArray"
                      :key="idx"
                    >
                      <a
                        :href="getExplorerLink(address)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="caller-address"
                      >
                        {{ address }}
                      </a>
                      <span
                        v-if="
                          row.callerNamesArray[idx] &&
                          row.callerNamesArray[idx] !== address
                        "
                        class="caller-name"
                      >
                        ({{ row.callerNamesArray[idx] }})
                      </span>
                    </li>
                  </ol>
                </template>
                <template v-else> none </template>
              </td>
              <td class="deployments">{{ row.deployments }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'highlight.js/styles/github-dark.css';
import hljs from 'highlight.js';

interface TableRow {
  function: string;
  contract: string;
  callerNames: string;
  callerNamesArray: string[];
  callerAddresses: string;
  callerAddressesArray: string[];
  deployments: string;
}

interface ActionIdsData {
  [key: string]: {
    [key: string]: {
      useAdaptor: boolean;
      actionIds: {
        [key: string]: string;
      };
    };
  };
}

interface Permissions {
  [key: string]: string[];
}

interface ReverseAddressBook {
  [key: string]: string;
}

export default defineComponent({
  name: 'PermissionTable',
  props: {
    chain: {
      type: String,
      default: 'mainnet',
    },
  },
  data() {
    return {
      tableData: [] as TableRow[],
      loading: true,
      error: null as Error | null,
    };
  },
  computed: {
    sortedTableData(): TableRow[] {
      return [...this.tableData].sort((a, b) =>
        a.function.toLowerCase().localeCompare(b.function.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchData();
    this.highlightCode();
  },
  updated() {
    this.highlightCode();
  },
  methods: {
    highlightCode() {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightBlock(block as HTMLElement);
      });
    },

    getExplorerLink(address: string): string {
      const baseUrl =
        this.chain === 'mainnet'
          ? 'https://etherscan.io/address/'
          : 'https://gnosisscan.io/address/';
      return `${baseUrl}${address}`;
    },

    isV3Related(deployment: string, callerNames: string[]): boolean {
      const isV3Deployment = deployment.includes('-v3-');
      const hasV3Caller = callerNames.some(
        name => name.includes('-v3-') || name.includes('/v3/')
      );
      return isV3Deployment || hasV3Caller;
    },

    async fetchData() {
      try {
        const [permissionsRes, reverseAddressRes, actionIdsRes] =
          await Promise.all([
            fetch(
              `https://raw.githubusercontent.com/BalancerMaxis/bal_addresses/main/outputs/permissions/active/${this.chain}.json`
            ),
            fetch(
              `https://raw.githubusercontent.com/BalancerMaxis/bal_addresses/main/outputs/${this.chain}_reverse.json`
            ),
            fetch(
              `https://raw.githubusercontent.com/balancer/balancer-deployments/master/action-ids/${this.chain}/action-ids.json`
            ),
          ]);

        const permissions = (await permissionsRes.json()) as Permissions;
        const reverseAddressBook =
          (await reverseAddressRes.json()) as ReverseAddressBook;
        const actionIds = (await actionIdsRes.json()) as ActionIdsData;

        const processedData: TableRow[] = [];

        Object.entries(actionIds).forEach(([deployment, contracts]) => {
          Object.entries(contracts).forEach(([contract, data]) => {
            if (!data.actionIds) return;

            Object.entries(data.actionIds).forEach(
              ([functionName, actionId]) => {
                const permissionAddresses = permissions[actionId] || [];

                const callerNamesArray = permissionAddresses.map(addr => {
                  let name =
                    reverseAddressBook[addr] ||
                    reverseAddressBook[addr.toLowerCase()];
                  return name || addr;
                });

                if (this.isV3Related(deployment, callerNamesArray)) {
                  processedData.push({
                    function: functionName,
                    contract: contract,
                    callerNames: callerNamesArray.join(', '),
                    callerNamesArray: callerNamesArray,
                    callerAddresses: permissionAddresses.join(', '),
                    callerAddressesArray: permissionAddresses,
                    deployments: deployment,
                  });
                }
              }
            );
          });
        });

        this.tableData = processedData;
        this.loading = false;
      } catch (err) {
        this.error = err instanceof Error ? err : new Error('Unknown error');
        this.loading = false;
        console.error('Error fetching data:', err);
      }
    },
  },
});
</script>

<style scoped>
.permissions-table {
  width: 100%;
  margin: 1rem 0;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--c-docs-card-border);
  border-radius: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: var(--background-color, #f8fafc);
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  border-bottom: 1px solid var(--c-docs-card-border);
}

td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--c-docs-card-border);
  vertical-align: top;
}

tr:last-child td {
  border-bottom: none;
}

.col-function {
  width: 15%;
}

.col-contract {
  width: 20%;
}

.col-callers {
  width: 50%;
}

.col-deployments {
  width: 15%;
}

.function {
  min-width: 150px;
  max-width: 300px;
}

.function pre {
  margin: 0;
  padding: 0;
}

.function code {
  font-family: monospace;
  font-size: 0.75rem;
  white-space: pre-wrap;
  display: block;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--code-bg);
  color: var(--code-text);
}

.contract {
  min-width: 150px;
  white-space: nowrap;
}

.callers {
  font-size: 0.875rem;
  min-width: 350px;
  padding-left: 0; /* Remove any cell padding */
}

.callers ol {
  padding-left: 1.5rem; /* Slightly reduced padding */
  list-style-position: outside;
  /* Pull the list slightly to the left */
  margin: 0 0 0 -1rem;
}

.callers li {
  margin-bottom: 0.25rem;
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  gap: 0.5rem;
  font-family: monospace;
  padding-left: 0.25rem; /* Small padding for list items */
}

.callers li:last-child {
  margin-bottom: 0;
}

.caller-address {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  font-family: monospace;
  font-size: 0.875rem;
}

.callers a:hover {
  text-decoration: underline;
}

.bullet {
  color: var(--c-text-lighter);
  margin-right: 0.5rem;
  font-size: 1.2em;
  line-height: 1;
}

.caller-name {
  font-family: var(--font-family);
  color: var(--c-text-lighter);
  white-space: normal;
  font-size: 0.875rem;
  min-width: 150px;
  margin-left: 0.25rem;
}

.callers a {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.callers a:hover {
  text-decoration: underline;
}

tr:hover {
  background-color: var(--background-color, #f8fafc);
}

/* Theme-aware syntax highlighting */
:deep(.hljs) {
  background: var(--code-bg) !important;
  color: var(--code-text) !important;
}

/* Light mode */
html:not(.dark) {
  --code-bg: #f8fafc;
  --code-text: #1e293b;
}

html:not(.dark) :deep(.hljs-keyword),
html:not(.dark) :deep(.hljs-built_in),
html:not(.dark) :deep(.hljs-type) {
  color: #2563eb !important; /* blue */
}

html:not(.dark) :deep(.hljs-string) {
  color: #059669 !important; /* green */
}

html:not(.dark) :deep(.hljs-number) {
  color: #db2777 !important; /* pink */
}

html:not(.dark) :deep(.hljs-comment) {
  color: #64748b !important; /* slate */
}

html:not(.dark) :deep(.hljs-function) {
  color: #334155 !important; /* darker slate blue for better readability */
}

/* Dark mode */
html.dark {
  --code-bg: #1a1b26;
  --code-text: #c0caf5;
}

html.dark :deep(.hljs-keyword),
html.dark :deep(.hljs-built_in),
html.dark :deep(.hljs-type) {
  color: #7aa2f7 !important; /* lighter blue */
}

html.dark :deep(.hljs-string) {
  color: #9ece6a !important; /* lighter green */
}

html.dark :deep(.hljs-number) {
  color: #ff9e64 !important; /* orange */
}

html.dark :deep(.hljs-comment) {
  color: #565f89 !important; /* muted blue */
}

html.dark :deep(.hljs-function) {
  color: #e2e8f0 !important; /* light gray with slight blue tint for dark mode */
}
</style>
