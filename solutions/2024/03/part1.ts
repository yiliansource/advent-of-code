export default function (input: string): number {
    return Array.from(input.matchAll(/mul\((\d+),(\d+)\)/g))
        .map((r) =>
            r
                .slice(1, 3)
                .map(Number)
                .reduce((a, c) => a * c, 1)
        )
        .reduce((a, c) => a + c, 0);
}
