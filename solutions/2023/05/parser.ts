interface Input {
    seeds: number[];
    maps: Record<
        string,
        {
            output: string;
            ranges: {
                destinationRangeStart: number;
                sourceRangeStart: number;
                length: number;
            }[];
        }
    >;
}

export default function (input: string): Input {
    const chunks = input.split("\n\n");
    const maps: Input["maps"] = {};

    for (const chunk of chunks.slice(1)) {
        const lines = chunk.split("\n");
        const identifier = lines[0].split(" ")[0].split("-");
        maps[identifier[0]] = {
            output: identifier[2],
            ranges: lines.slice(1).map((line) => {
                const [destinationRangeStart, sourceRangeStart, length] = line.split(" ").map(Number);
                return {
                    destinationRangeStart,
                    sourceRangeStart,
                    length,
                };
            }),
        };
    }

    return {
        seeds: chunks[0].split(": ")[1].split(" ").map(Number),
        maps,
    };
}
