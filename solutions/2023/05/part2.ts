export default function (text: string): number {
    let min = Number.POSITIVE_INFINITY;
    const input = parseInput(text);
    const ponderingRanges: [string, Range][] = input.seedRanges.slice().map((r) => ["seed", r]);

    while (ponderingRanges.length > 0) {
        const [type, range] = ponderingRanges.pop()!;
        if (type === "location") {
            min = Math.min(min, range[0]);
        } else {
            let wasTransformed: boolean = false;
            for (const mapping of input.maps[type].ranges) {
                const inter = intersect(range, mapping.source);
                if (!!inter) {
                    const transformedStart = mapping.dest[0] + inter[0] - mapping.source[0];
                    ponderingRanges.push([
                        input.maps[type].output,
                        [transformedStart, transformedStart + (inter[1] - inter[0])],
                    ]);
                    const diff = difference(range, inter);
                    ponderingRanges.push(...diff.map((r) => [type, r] as [string, Range]));
                    wasTransformed = true;
                    break;
                }
            }
            if (!wasTransformed) {
                ponderingRanges.push([input.maps[type].output, range]);
            }
        }
    }

    return min;
}

type Range = [number, number];

export function intersect([aStart, aEnd]: Range, [bStart, bEnd]: Range): Range | null {
    if (bStart > aEnd || aStart > bEnd) {
        return null;
    }
    return [Math.max(aStart, bStart), Math.min(aEnd, bEnd)];
}

export function difference([aStart, aEnd]: Range, [bStart, bEnd]: Range): Range[] {
    const intersection = intersect([aStart, aEnd], [bStart, bEnd]);
    if (!intersection) return [[aStart, aEnd]];

    const [iStart, iEnd] = intersection;
    if (iStart === aStart && iEnd == aEnd) return [];

    const result: Range[] = [];
    if (aStart < iStart) result.push([aStart, iStart - 1]);
    if (aEnd > iEnd) result.push([iEnd + 1, aEnd]);
    return result;
}

interface Input {
    seedRanges: Range[];
    maps: Record<
        string,
        {
            output: string;
            ranges: {
                source: Range;
                dest: Range;
            }[];
        }
    >;
}

function parseInput(input: string): Input {
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
                    source: [sourceRangeStart, sourceRangeStart + length - 1],
                    dest: [destinationRangeStart, destinationRangeStart + length - 1],
                };
            }),
        };
    }

    const seedRanges: Range[] = [];
    const seedData = chunks[0].split(": ")[1].split(" ").map(Number);
    for (let i = 0; i < seedData.length; i += 2) {
        seedRanges.push([seedData[i], seedData[i] + seedData[i + 1] - 1]);
    }

    return {
        seedRanges,
        maps,
    };
}
