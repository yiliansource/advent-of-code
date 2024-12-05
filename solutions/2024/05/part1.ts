export default function (input: string): number {
    const [rulesInput, updatesInput] = input.split("\n\n");
    const [rules, updates] = [
        rulesInput.split("\n").map((rule) => rule.split("|").map(Number) as [number, number]),
        updatesInput.split("\n").map((update) => update.split(",").map(Number)),
    ];

    return updates
        .map(
            (update) =>
                update[Math.floor(update.length / 2)] *
                Number(
                    rules
                        .filter((pages) => pages.every((page) => update.includes(page)))
                        .every(([a, b]) => update.indexOf(a) < update.indexOf(b))
                )
        )
        .reduce((acc, cur) => acc + cur, 0);
}
