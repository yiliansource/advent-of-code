export default function (input: string): string {
    const [registerInput, programInput] = input.split("\n\n");

    const out: number[] = [];
    const program = programInput.slice("Program: ".length).split(",").map(Number);
    const registers: Record<string, number> = Object.fromEntries(
        registerInput.split("\n").map((l) => {
            const [id, value] = l.match(/Register (\w): (\d+)/)!.slice(1);
            return [id, Number(value)];
        })
    );

    let instructionPointer = 0;
    const combo = (op: number): number => (op <= 3 ? op : registers[String.fromCharCode("A".charCodeAt(0) + (op - 4))]);
    const instructions: ((operand: number) => void)[] = [
        (op) => void (registers["A"] = Math.trunc(registers["A"] / Math.pow(2, combo(op)))),
        (op) => void (registers["B"] = registers["B"] ^ op),
        (op) => void (registers["B"] = combo(op) & 0b111),
        (op) => void (instructionPointer = registers["A"] === 0 ? instructionPointer + 2 : op),
        (_) => void (registers["B"] ^= registers["C"]),
        (op) => void out.push(combo(op) & 0b111),
        (op) => void (registers["B"] = Math.trunc(registers["A"] / Math.pow(2, combo(op)))),
        (op) => void (registers["C"] = Math.trunc(registers["A"] / Math.pow(2, combo(op)))),
    ];

    while (instructionPointer < program.length) {
        const instruction = program[instructionPointer];
        const operand = program[instructionPointer + 1];

        instructions[instruction](operand);

        if (instruction !== 3) instructionPointer += 2;
    }

    return out.join(",");
}
