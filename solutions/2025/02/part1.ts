export default function (input: string): number {
    return input
        .split(",")
        .map((p) => p.split("-").map(Number))
        .map(([start, end]) => {
            const startString = start.toString();
            const endString = end.toString();

            const startHalf = Number(startString.slice(0, Math.floor(startString.length / 2)));
            const endHalf = Number(endString.slice(0, Math.ceil(endString.length / 2)));

            let invalids = 0;
            for (let i = startHalf; i <= endHalf; i++) {
                const composite = Number(i.toString().repeat(2));
                if (start <= composite && composite <= end) {
                    invalids += composite;
                }
            }
            return invalids;
        })
        .reduce((acc, cur) => acc + cur, 0);
}
