export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => {
            const sequence = line.split(" ").map(Number);

            const tower: number[][] = [[sequence.at(-1)!]];
            while (tower[0].length !== sequence.length) {
                tower.push([]);
                tower[0].unshift(sequence.at(-1 - tower[0].length)!);
                for (let i = 1; i < tower.length; i++) {
                    tower[i].unshift(tower[i - 1][1] - tower[i - 1][0]);
                }
            }

            tower.at(-1)!.push(0);
            for (let i = tower.length - 2; i >= 0; i--) {
                tower[i].push(tower[i].at(-1)! + tower[i + 1].at(-1)!);
            }

            return tower[0].at(-1)!;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
