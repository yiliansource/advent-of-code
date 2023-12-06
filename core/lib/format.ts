export function formatDuration(ms: number, decimals = 4): string {
    if (ms > 500) {
        return (ms / 1000).toFixed(decimals) + "s";
    }
    return ms.toFixed(decimals) + "ms";
}
export function parseDuration(duration: string): number {
    const multiplierTable: Record<string, number> = {
        s: 1 / 1000,
        ms: 1,
    };
    const [, amount, unit] = (duration.match(/(\d+\.\d+)([a-z]*s)/) as [null, number, string]) ?? [null, 0, "ms"];
    return Number(amount) * multiplierTable[unit];
}
