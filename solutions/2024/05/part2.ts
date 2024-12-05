export default function (input: string): number {
    const [rulesInput, updatesInput] = input.split("\n\n");
    const [rules, updates] = [
        rulesInput.split("\n").map((rule) => rule.split("|").map(Number) as [number, number]),
        updatesInput.split("\n").map((update) => update.split(",").map(Number)),
    ];

    return updates
        .map(
            (update) =>
                [
                    update,
                    rules
                        .filter((pages) => pages.every((page) => update.includes(page)))
                        .filter(([a, b]) => update.indexOf(a) > update.indexOf(b)),
                ] as [typeof update, typeof rules]
        )
        .filter(([_, incorrectRules]) => incorrectRules.length > 0)
        .map(([update, incorrectRules]) =>
            update.sort((a, b) => {
                const rule = incorrectRules.find((r) => r.includes(a) && r.includes(b));
                return rule ? (rule[0] === a ? -1 : 1) : 0;
            })
        )
        .map((update) => update[Math.floor(update.length / 2)])
        .reduce((acc, cur) => acc + cur, 0);
}
