export default function (input: string): number {
    return input
        .split(",")
        .map((p) => p.split("-").map(Number))
        .flatMap(([start, end]) => {
            const startString = start.toString();
            const endString = end.toString();

            // console.log("range:", start, end);

            const invalids = new Set<number>();
            for (let k = 2; k <= startString.length + 1; k++) {
                const startPart = Number(startString.slice(0, Math.floor(startString.length / k)));
                const endPart = Number(endString.slice(0, Math.ceil(endString.length / k)));

                // console.log("k=", k, "parts:", startPart, endPart);

                for (let i = startPart; i <= endPart; i++) {
                    const composite = Number(i.toString().repeat(k));
                    if (composite < 10000) {
                        // console.log(composite);
                    }
                    if (start <= composite && composite <= end) {
                        invalids.add(composite);
                    }
                }
            }

            // console.log("invalids", ...invalids);

            return [...invalids];
        })
        .reduce((acc, cur) => acc + cur, 0);
}
