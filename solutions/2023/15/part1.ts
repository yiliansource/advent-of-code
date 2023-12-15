export default function (input: string): number {
    return input
        .split(",")
        .map((word) => word.split("").reduce((acc, cur) => ((acc + cur.charCodeAt(0)) * 17) % 256, 0))
        .reduce((acc, cur) => acc + cur, 0);
}
