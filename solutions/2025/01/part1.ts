export default function (input: string): number {
    const amod = (n: number, m: number) => ((n % m) + m) % m;
    return input.split("\n").reduce<[number, number]>(
        ([dial, password], instruction) => {
            const sign = instruction[0] === "L" ? -1 : 1;
            const amount = parseInt(instruction.slice(1));
            const newDial = amod(dial + sign * amount, 100);
            return [newDial, password + (newDial === 0 ? 1 : 0)];
        },
        [50, 0]
    )[1];
}
