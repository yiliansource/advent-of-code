export default function (input: string): number {
    const games = parse(input);
    const allowed: Record<Color, number> = {
        red: 12,
        green: 13,
        blue: 14,
    };

    return games
        .map((game) => {
            for (const set of game.sets) {
                const bag = Object.assign({}, allowed);
                for (const move of set) {
                    if (bag[move.color] < move.amount) {
                        return 0;
                    }
                    bag[move.color] -= move.amount;
                }
            }
            return game.id;
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
