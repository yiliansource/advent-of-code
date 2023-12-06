export default function (input: string): number {
    let result = 1;
    const [Ts, Ds] = input.split("\n").map((l) => l.split(/ +/).slice(1).map(Number));
    for (let i = 0; i < Ts.length; i++) {
        const T = Ts[i];
        const D = Ds[i];

        const disc = Math.sqrt((T * T) / 4 - D);
        const r1 = T / 2 - disc;
        const r2 = T / 2 + disc;

        result *= Math.ceil(r2) - Math.floor(r1) - 1;
    }
    return result;
}
