export function normalizeSurahName(name: string) {
    return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

export function isBlankName(name: string) {
    return normalizeSurahName(name).length === 0;
}
