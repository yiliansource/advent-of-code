export default function (input: string): number {
    return input
        .split("\n")
        .map((l) => l.split(" ").map(Number))
        .map((l) => l.slice(1).map((e, i) => e - l[i]))
        .map((d) => d.every((e) => Math.abs(e) <= 3) && (d.every((e) => e > 0) || d.every((e) => e < 0)))
        .reduce((a, s) => a + Number(s), 0);
}
