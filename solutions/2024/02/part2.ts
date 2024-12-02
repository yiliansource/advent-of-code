export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(" ").map(Number))
        .map((l) => [l.slice(), ...[...Array(l.length).keys()].map((i) => l.toSpliced(i, 1))])
        .map((p) =>
            p

                .map((l) => l.slice(1).map((e, i) => e - l[i]))
                .some((d) => d.every((e) => e > 0 && e <= 3) || d.every((e) => e < 0 && e >= -3))
        )
        .reduce((a, s) => a + Number(s), 0);
}
