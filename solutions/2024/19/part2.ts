export default function (input: string): number {
    const [availableTowelsInput, designsInput] = input.split("\n\n");
    const availableTowels = availableTowelsInput.split(", ");
    const memo = new Map<string, number>();
    const countWaysToProduce = (design: string): number => {
        if (memo.has(design)) return memo.get(design)!;
        let possibleSubdesigns = 0;
        for (const t of availableTowels) {
            if (design === t) {
                possibleSubdesigns++;
            } else if (design.startsWith(t)) {
                possibleSubdesigns += countWaysToProduce(design.substring(t.length));
            }
        }
        memo.set(design, possibleSubdesigns);
        return possibleSubdesigns;
    };
    return designsInput
        .split("\n")
        .map(countWaysToProduce)
        .reduce((acc, cur) => acc + cur, 0);
}
