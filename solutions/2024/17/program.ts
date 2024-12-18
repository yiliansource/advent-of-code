export default function (input: string): number {
    // 2,4,1,1,7,5,1,5,4,5,0,3,5,5,3,0

    let a = 0,
        b = 0,
        c = 0;

    const combo = (op: number) => 0;
    const out: number[] = [];
    // 3 0
    while (a != 0) {
        // 2 4
        b = combo(4) & 7;
        // 1 1
        b ^= 1;
        // 7 5
        c = Math.trunc(a >> combo(5));
        // 1 5
        b ^= 5;
        // 4 5
        b ^= c;
        // 0 3
        a = Math.trunc(a >> combo(3));
        // 5 5
        out.push(combo(5) & 7);
    }

    return -1;
}
