type Coord = [number, number];

export default function (input: string): number {
    const grid = input.split("\n").map((l) => l.split(""));

    const findAntennas = (freq: string): Coord[] => {
        const coords: Coord[] = [];
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] == freq) {
                    coords.push([i, j]);
                }
            }
        }
        return coords;
    };
    const makeAntennaPairs = (antennas: Coord[]) => {
        const pairs: [Coord, Coord][] = [];
        for (let k = 0; k < antennas.length; k++) {
            for (let l = k + 1; l < antennas.length; l++) {
                pairs.push([antennas[k], antennas[l]]);
            }
        }
        return pairs;
    };

    const frequencies = new Set(grid.flat());
    frequencies.delete(".");

    const antinodes = new Set<string>();
    const makeAntinode = ([i, j]: Coord) => {
        if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
            antinodes.add(i + "," + j);
        }
    };

    for (const freq of frequencies) {
        const antennas = findAntennas(freq);
        const pairs = makeAntennaPairs(antennas);

        for (const pair of pairs) {
            const [[x1, y1], [x2, y2]] = pair;
            const [dx, dy] = [x2 - x1, y2 - y1];

            for (let i = -grid.length; i <= grid.length; i++) {
                makeAntinode([x1 - dx * i, y1 - dy * i]);
            }
        }
    }

    return antinodes.size;
}
