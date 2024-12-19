export default function (input: string): number {
    const [availableTowelsInput, designsInput] = input.split("\n\n");
    const availableTowels = availableTowelsInput.split(", ");
    const canProduceDesign = (design: string): boolean =>
        !design ||
        availableTowels.some((t) => (design.startsWith(t) ? canProduceDesign(design.substring(t.length)) : false));
    return designsInput.split("\n").filter(canProduceDesign).length;
}
