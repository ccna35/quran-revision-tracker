import type { SortOption } from '@/types/surah';

export const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: 'Days high-low', value: 'days-desc' },
    { label: 'Days low-high', value: 'days-asc' },
    { label: 'Name A-Z', value: 'name-asc' },
    { label: 'Name Z-A', value: 'name-desc' },
];
