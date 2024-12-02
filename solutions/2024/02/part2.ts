export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(" ").map(Number))
        .map((l) => [l.slice(), ...[...Array(l.length).keys()].map((i) => l.slice(0, i).concat(l.slice(i + 1)))])
        .map((p) =>
            p
                .map((l) => l.map((e, i) => l[i + 1] - e).slice(0, -1))
                .some((d) => d.every((e) => Math.abs(e) <= 3) && (d.every((e) => e > 0) || d.every((e) => e < 0)))
        )
        .reduce((a, s) => a + Number(s), 0);
}
