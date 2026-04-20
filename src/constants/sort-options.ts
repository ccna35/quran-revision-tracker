import type { SortOption } from '@/types/surah';

export const sortOptions: Array<{ label: string; value: SortOption }> = [
    { label: 'الأيام: الأعلى فالأقل', value: 'days-desc' },
    { label: 'الأيام: الأقل فالأعلى', value: 'days-asc' },
    { label: 'الاسم: أ إلى ي', value: 'name-asc' },
    { label: 'الاسم: ي إلى أ', value: 'name-desc' },
];
