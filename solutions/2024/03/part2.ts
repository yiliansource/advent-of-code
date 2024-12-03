export default function (input: string): number {
    return Array.from(input.matchAll(/(?<k>do|don't|mul)(\(\)|\((\d+),(\d+)\))/g))
        .map((r) => [r.groups!.k, ...r.slice(3).filter(Boolean).map(Number)] as [string] | [string, number, number])
        .reduce(
            ([d, v], [k, ...r]) =>
                [k === "don't" ? false : k === "do" ? true : d, v + (r.length > 0 && d ? r[0]! * r[1]! : 0)] as [
                    boolean,
                    number
                ],
            [true, 0] as [boolean, number]
        )[1];
}
