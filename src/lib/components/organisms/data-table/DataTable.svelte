<script lang="ts">
    import TableCell from "$lib/components/atoms/table-cell/TableCell.svelte";
    import Table from "$lib/components/molecules/table-row/Table.svelte";
    import TableRow from "$lib/components/molecules/table-row/TableRow.svelte";

    type Column<T> = {
        key: keyof T;
        label: string;
    };

    const {
        columns,
        rows,
    }: {
        columns: Column<any>[];
        rows: any[];
    } = $props();
</script>

<Table>
    <thead>
        <TableRow header>
            {#each columns as column}
                <TableCell as="th">{column.label}</TableCell>
            {/each}
        </TableRow>
    </thead>

    <tbody>
        {#if rows.length === 0}
            <tr>
                <td
                    colspan={columns.length}
                    class="p-4 text-center text-gray-500"
                >
                    No hay datos
                </td>
            </tr>
        {:else}
            {#each rows as row}
                <TableRow>
                    {#each columns as column}
                        <TableCell>{row[column.key]}</TableCell>
                    {/each}
                </TableRow>
            {/each}
        {/if}
    </tbody>
</Table>
