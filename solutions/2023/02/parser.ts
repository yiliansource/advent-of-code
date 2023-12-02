export type Color = "blue" | "red" | "green";
export interface Game {
    id: number;
    sets: {
        amount: number;
        color: Color;
    }[][];
}

export default function (input: string): Game[] {
    return input.split("\n").map((line) => {
        const parts = line.split(": ");
        const id = Number(parts[0].split(" ")[1]);
        const sets = parts[1].split("; ").map((moves) => {
            const actions = moves.split(", ");
            return actions.map((action) => {
                const split = action.split(" ");
                return {
                    amount: Number(split[0]),
                    color: split[1] as Color,
                };
            });
        });

        return {
            id,
            sets,
        };
    });
}
