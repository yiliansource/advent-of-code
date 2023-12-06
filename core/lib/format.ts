export function formatDuration(ms: number, decimals = 4): string {
    if (ms > 500) {
        return (ms / 1000).toFixed(decimals) + "s";
    }
    return ms.toFixed(decimals) + "ms";
}
