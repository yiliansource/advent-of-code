export default function (input: string): number {
    const hmap: Map<number, [string, number][]> = new Map();
    for (const word of input.split(",")) {
        if (word.endsWith("-")) {
            const label = word.split("-")[0];
            const h = hash(label);
            if (hmap.has(h)) {
                const list = hmap.get(h)!;
                hmap.set(
                    h,
                    list.filter(([l]) => l !== label)
                );
            }
        } else {
            const [label, val] = word.split("=");
            const h = hash(label);
            const list = hmap.get(h) ?? [];
            let found = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i][0] === label) {
                    list[i][1] = Number(val);
                    found = true;
                }
            }
            if (!found) {
                list.push([label, Number(val)]);
            }
            hmap.set(h, list);
        }
    }

    let acc = 0;
    for (const box of hmap.keys()) {
        const list = hmap.get(box)!;
        for (let i = 0; i < list.length; i++) {
            const [, val] = list[i];
            acc += (box + 1) * (i + 1) * val;
        }
    }
    return acc;
}

function hash(word: string): number {
    return word.split("").reduce((acc, cur) => ((acc + cur.charCodeAt(0)) * 17) % 256, 0);
}
