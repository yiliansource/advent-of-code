export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => {
            const sequence = line.split(" ").map(Number);

            const tower: number[][] = [[sequence[0]]];
            while (tower[0].length !== sequence.length) {
                tower.push([]);
                tower[0].push(sequence[tower[0].length]);
                for (let i = 1; i < tower.length; i++) {
                    tower[i].push(tower[i - 1].at(-1)! - tower[i - 1].at(-2)!);
                }
            }

            tower.at(-1)!.unshift(0);
            for (let i = tower.length - 2; i >= 0; i--) {
                tower[i].unshift(tower[i][0] - tower[i + 1][0]);
            }

            return tower[0][0];
        })
        .reduce((acc, cur) => acc + cur, 0);
}
