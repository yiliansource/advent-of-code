export default function (input: string): number {
    const [rangeInput] = input.split("\n\n");
    const ranges = rangeInput.split("\n").map((r) => r.split("-").map(Number) as [number, number]);

    for (let headIndex = 0; headIndex < ranges.length; headIndex++) {
        let [headStart, headEnd] = ranges[headIndex];
        for (let currentIndex = headIndex + 1; currentIndex < ranges.length; currentIndex++) {
            let [currentStart, currentEnd] = ranges[currentIndex];
            if (!(headEnd < currentStart || headStart > currentEnd)) {
                [headStart, headEnd] = ranges[headIndex] = [
                    Math.min(headStart, currentStart),
                    Math.max(headEnd, currentEnd),
                ];
                ranges.splice(currentIndex, 1);
                currentIndex = headIndex;
            }
        }
    }

    return ranges.reduce((acc, [start, end]) => acc + (end - start + 1), 0);
}
