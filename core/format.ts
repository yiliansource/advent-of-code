export function formatDuration(ms: number): string {
    if (ms > 500) {
        return (ms / 1000).toFixed(2) + "s";
    }
    return ms.toFixed(2) + "ms";
}
