export function withPerformance<T>(fun: () => T): [T, number] {
    const start = performance.now();
    const res = fun();
    const end = performance.now();

    const delta = end - start;
    return [res, delta];
}

export async function withPerformanceAsync<T>(fun: () => Promise<T>): Promise<[T, number]> {
    const start = performance.now();
    const res = await fun();
    const end = performance.now();

    const delta = end - start;
    return [res, delta];
}
