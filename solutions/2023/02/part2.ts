import { Color } from "./parser";

export default function (games: ReturnType<typeof import("./parser.js").default>): number {
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
