export default function (input: string): number {
    const amod = (n: number, m: number) => ((n % m) + m) % m;
    return input.split("\n").reduce<[number, number]>(
        ([dial, password], instruction) => {
            const sign = instruction[0] === "L" ? -1 : 1;
            const amount = parseInt(instruction.slice(1));

            const fullRotations = Math.floor(amount / 100);
            password += fullRotations;
            const leftoverAmount = amount % 100;

            const newDial = dial + sign * leftoverAmount;
            if (dial !== 0 && (newDial <= 0 || newDial >= 100)) password++;

            return [amod(newDial, 100), password] as [number, number];
        },
        [50, 0]
    )[1];
}
