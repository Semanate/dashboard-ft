type Column<T> = {
    key: keyof T;
    label: string;
    sortable?: boolean;
};

export function createDataTable<T>(rows: T[], columns: Column<T>[]) {
    const page = $state(1);
    const pageSize = $state(5);
    let sortKey = $state<keyof T | null>(null);
    let sortDir = $state<'asc' | 'desc'>('asc');

    const sortedRows = $derived(() => {
        console.log('Sorting rows with key:', sortKey, 'and direction:', sortDir);
        if (!sortKey) return rows;

        
        return [...rows].sort((a, b) => {
            if (!sortKey) return 0;
            
            const av = a[sortKey];
            const bv = b[sortKey];

            if (av === bv) return 0;
            return sortDir === 'asc'
                ? av > bv ? 1 : -1
                : av < bv ? 1 : -1;
        });
    });

    const paginatedRows = $derived(() => {
        const start = (page - 1) * pageSize;
        return sortedRows().slice(start, start + pageSize);
    });

    function toggleSort(key: keyof T) {
        if (sortKey === key) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            sortKey = key;
            sortDir = 'asc';
        }
    }

    return {
        columns,
        page,
        pageSize,
        sortKey,
        sortDir,
        rows: paginatedRows,
        total: rows.length,
        toggleSort
    };
}
