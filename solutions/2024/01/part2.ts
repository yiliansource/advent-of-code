export default function (input: string): number {
    const matrix = input.split("\n").map((l) => l.split(/ +/).map(Number));
    const transpose = matrix[0].map((_, i) => matrix.map((row) => row[i]));
    return [...Array(matrix.length).keys()].reduce((acc, cur) => {
        const el = transpose[0][cur];
        return acc + el * transpose[1].filter((e) => e === el).length;
    }, 0);
}
