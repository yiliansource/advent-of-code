export default function (input: string): number {
    const [T, D] = input.split("\n").map((l) => Number(l.replace(/ /g, "").split(":")[1]));
    const disc = Math.sqrt((T * T) / 4 - D);
    const r1 = T / 2 - disc;
    const r2 = T / 2 + disc;
    return Math.ceil(r2) - Math.floor(r1) - 1;
}
