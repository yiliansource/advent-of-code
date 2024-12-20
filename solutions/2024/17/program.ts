export default function (): number {
    // 2,4,1,1,7,5,1,5,4,5,0,3,5,5,3,0

    let a = 0,
        b = 0,
        c = 0;

    const combo = (op: number) => {
        if (op >= 0 && op <= 3) return op;
        if (op === 4) return a;
        if (op === 5) return b;
        if (op === 6) return c;
        throw new Error();
    };
    const out: number[] = [];

    // 3 0
    while (a != 0) {
        // 2 4
        b = a & 7;
        // 1 1
        b = b ^ 1;
        // 7 5
        c = Math.trunc(a >> b);
        // 1 5
        b = b ^ 5;
        // 4 5
        b = b ^ c;
        // 0 3
        a = Math.trunc(a >> 3);
        // 5 5
        out.push(b & 7);
    }

    while (out.length > 0) {
        b = out[out.length - 1];
        a = a << 3;
        b ^= c;
        b ^= 5;
    }

    return -1;
}
