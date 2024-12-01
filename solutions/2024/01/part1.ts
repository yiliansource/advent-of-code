export default function (input: string): number {
    const matrix = input.split("\n").map((l) => l.split(/ +/).map(Number));
    const transpose = matrix[0].map((_, i) => matrix.map((row) => row[i]).sort());
    return [...Array(matrix.length).keys()].reduce(
        (acc, cur) => acc + Math.abs(transpose[0][cur] - transpose[1][cur]),
        0
    );
}
