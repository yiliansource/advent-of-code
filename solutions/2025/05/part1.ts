export default function (input: string): number {
    const [rangeInput, ingredientInput] = input.split("\n\n");
    const ranges = rangeInput.split("\n").map((r) => r.split("-").map(Number) as [number, number]);
    const ingredients = ingredientInput.split("\n").map(Number);

    let fresh = 0;
    for (const ingredient of ingredients) {
        for (const [start, end] of ranges) {
            if (start <= ingredient && ingredient <= end) {
                fresh++;
                break;
            }
        }
    }

    return fresh;
}
