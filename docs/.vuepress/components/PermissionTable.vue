<template>
  <div class="permissions-table">
    <div v-if="loading" class="loading">Loading permission table...</div>

    <div v-else-if="error" class="error">
      Error loading data. Please try again later.
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Contract</th>
            <th>Caller Names</th>
            <th>Caller Addresses</th>
            <th>Deployments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in sortedTableData" :key="index">
            <td class="function">
              <code>{{ row.function }}</code>
            </td>
            <td class="contract">{{ row.contract }}</td>
            <td class="caller-names">
              <ol>
                <li v-for="name in row.callerNamesArray" :key="name">
                  {{ name }}
                </li>
              </ol>
            </td>
            <td class="caller-addresses">
              <ol>
                <li
                  v-for="(address, idx) in row.callerAddressesArray"
                  :key="idx"
                >
                  <code>{{ address }}</code>
                </li>
              </ol>
            </td>
            <td class="deployments">{{ row.deployments }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  async mounted() {
    await this.fetchData();
  },
  methods: {
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
              'https://raw.githubusercontent.com/balancer/balancer-deployments/master/action-ids/mainnet/action-ids.json'
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
                  let name = reverseAddressBook[addr];
                  if (!name) {
                    name = reverseAddressBook[addr.toLowerCase()];
                  }
                  return name || addr;
                });

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
  padding: 0.75rem 1rem;
  font-weight: 600;
  border-bottom: 1px solid var(--c-docs-card-border);
}

td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--c-docs-card-border);
  vertical-align: top;
}

tr:last-child td {
  border-bottom: none;
}

.function code {
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  max-width: 300px;
  background-color: var(--c-bg-light);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.caller-names ol,
.caller-addresses ol {
  margin: 0;
  padding-left: 1.5rem;
}

.caller-names li,
.caller-addresses li {
  margin-bottom: 0.25rem;
}

.caller-addresses code {
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
  background-color: var(--c-bg-light);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.loading,
.error {
  padding: 1rem;
  text-align: center;
}

.error {
  color: #dc2626;
}

tr:hover {
  background-color: var(--background-color, #f8fafc);
}
</style>
