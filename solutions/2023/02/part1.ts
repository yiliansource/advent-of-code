import { Color } from "./parser";

export default function (games: ReturnType<typeof import("./parser.js").default>): number {
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
