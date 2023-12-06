export default function (input: string): number {
    const games = parse(input);
    return games
        .map((game) => {
            const required: Record<Color, number> = {
                red: 0,
                green: 0,
                blue: 0,
            };
            for (const set of game.sets) {
                const bag: Record<Color, number> = {
                    red: 0,
                    green: 0,
                    blue: 0,
                };
                for (const move of set) {
                    bag[move.color] += move.amount;
                }
                (["red", "green", "blue"] as Color[]).forEach(
                    (col) => (required[col] = Math.max(required[col], bag[col]))
                );
            }
            return required.blue * required.green * required.red;
        })
        .reduce((acc, cur) => acc + cur, 0);
}

type Color = "blue" | "red" | "green";
interface Game {
    id: number;
    sets: {
        amount: number;
        color: Color;
    }[][];
}

function parse(input: string): Game[] {
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
