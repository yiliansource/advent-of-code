export default function (input: string): number[][][] {
    return input.split("\n").map((line) => {
        return line
            .split(/: +/)[1]
            .split(/ +\| +/)
            .map((parts) => parts.split(/ +/).map(Number));
    });
}
