export default function (input: string): number {
    const lines = input.split("\n");
    const instructions = lines[0].split("").map((c) => (c === "R" ? 1 : 0));
    const nodes: Record<string, [string, string]> = Object.fromEntries(
        lines.slice(2).map((line) => {
            const [label, left, right] = line.match(/\w+/g)!;
            return [label, [left, right]];
        })
    );

    return Object.keys(nodes)
        .filter((n) => n.endsWith("A"))
        .map((start) => {
            let node = start;
            let steps = 0;

            while (!node.endsWith("Z")) {
                node = nodes[node][instructions[steps % instructions.length]];
                steps++;
            }

            return steps;
        })
        .reduce(lcm);
}

const gcd = (a: number, b: number): number => (a ? gcd(b % a, a) : b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
