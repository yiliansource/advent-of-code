export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => line.split("").map(Number))
        .map((bank) => {
            const leftMax = Math.max(...bank.slice(0, -1));
            const leftMaxIndex = bank.indexOf(leftMax);
            const rightMax = Math.max(...bank.slice(leftMaxIndex + 1));
            return leftMax * 10 + rightMax;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
