export default function (input: string): number {
    const lines = input.split("\n");
    const instructions = lines[0].split("").map((c) => (c === "R" ? 1 : 0));
    const nodes: Record<string, [string, string]> = Object.fromEntries(
        lines.slice(2).map((line) => {
            const [label, left, right] = line.match(/[A-Z]+/g)!;
            return [label, [left, right]];
        })
    );

    let steps = 0;
    let node = "AAA";

    while (node !== "ZZZ") {
        node = nodes[node][instructions[steps % instructions.length]];
        steps++;
    }

    return steps;
}
