export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => line.split("").map(Number))
        .map((bank) => {
            const digits: number[] = [];
            for (let k = 11; k >= 0; k--) {
                const head = k > 0 ? bank.slice(0, -k) : bank.slice();
                const leftMax = Math.max(...head);
                const leftMaxIndex = bank.indexOf(leftMax);
                digits.push(leftMax);
                bank = bank.slice(leftMaxIndex + 1);
            }

            return Number(digits.join(""));
        })
        .reduce((acc, cur) => acc + cur, 0);
}
