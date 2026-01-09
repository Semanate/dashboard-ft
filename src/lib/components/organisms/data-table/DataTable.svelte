<script lang="ts">
    import ButtonWithIcon from "$lib/components/atoms/button/ButtonWithIcon.svelte";
    import Icon from "$lib/components/atoms/icon/Icon.svelte";
    import TableCell from "$lib/components/atoms/table-cell/TableCell.svelte";
    import Table from "$lib/components/molecules/table-row/Table.svelte";
    import TableRow from "$lib/components/molecules/table-row/TableRow.svelte";

    const {
        table,
        onEdit,
        actions,
        onDelete,
    }: {
        table: any;
        onEdit: (row: any) => void;
        onDelete: (row: any) => void;
        actions: Array<{
            iconName: string;
            iconClass?: string;
            onclick: (row: any) => void;
        }>;
    } = $props();
</script>

<Table>
    <thead>
        <TableRow header>
            {#each table.columns as col}
                <TableCell
                    as="th"
                    onclick={() => col.sortable && table.toggleSort(col.key)}
                    class={col.sortable ? "cursor-pointer" : ""}
                >
                    {col.label}
                    {#if table.sortKey === col.key}
                        {table.sortDir === "asc" ? " ↑" : " ↓"}
                    {/if}
                </TableCell>
            {/each}
            <TableCell as="th">Acciones</TableCell>
        </TableRow>
    </thead>

    <tbody>
        {#each table.rows() as row}
            <TableRow>
                {#each table.columns as col}
                    <TableCell>{row[col.key]}</TableCell>
                {/each}
                <TableCell class="flex gap-0.5">
                    <TableCell class="flex gap-0.5">
                        {#if !actions || actions.length === 0}
                            <ButtonWithIcon
                                variant="ghost"
                                label=""
                                size="small"
                                onclick={() => onDelete(row)}
                            >
                                <Icon
                                    name="Trash"
                                    className="text-orange-300/80"
                                />
                            </ButtonWithIcon>

                            <ButtonWithIcon
                                variant="ghost"
                                size="small"
                                label=""
                                onclick={() => onEdit(row)}
                            >
                                <Icon
                                    name="Edit"
                                    className="text-blue-300/80"
                                />
                            </ButtonWithIcon>
                        {:else}
                            {#each actions as Action}
                                <ButtonWithIcon
                                    variant="ghost"
                                    size="small"
                                    label=""
                                    onclick={() => Action.onclick(row)}
                                >
                                    <Icon
                                        name={Action.iconName}
                                        className={Action.iconClass}
                                    />
                                </ButtonWithIcon>
                            {/each}
                        {/if}
                    </TableCell>
                </TableCell>
            </TableRow>
        {/each}
    </tbody>
</Table>

<div class="flex gap-2 mt-4 items-center justify-between">
    <ButtonWithIcon
        variant="ghost"
        label="Anterior"
        iconButton="MoveLeft"
        onclick={() => table.page--}
        disabled={table.page === 1}
    /><span>Página {table.page}</span>
    <ButtonWithIcon
        label="Siguiente"
        onclick={() => table.page++}
        disabled={table.page * table.pageSize >= table.total}
    >
        <Icon name="MoveRight" className="ml-2" />
    </ButtonWithIcon>
</div>
