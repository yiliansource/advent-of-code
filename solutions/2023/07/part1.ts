export default function (input: string): number {
    return input
        .split("\n")
        .map((line) => line.split(" "))
        .map(([hand, bet]) => [hand, scoreHand(hand), Number(bet)] as [string, number, number])
        .sort(([, a], [, b]) => a - b)
        .reduce((acc, cur, i) => acc + cur[2] * (i + 1), 0);
}

function scoreHand(hand: string): number {
    const occurr = hand.split("").reduce((acc, cur) => {
        acc[cur] = (acc[cur] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const numOccurr = Object.values(occurr);

    let rank = 0;
    if (numOccurr.includes(2)) {
        rank = 1;
    }
    if (numOccurr.filter((o) => o === 2).length === 2) {
        rank = 2;
    }
    if (numOccurr.includes(3)) {
        rank = 3;
    }
    if (numOccurr.includes(3) && numOccurr.includes(2)) {
        rank = 4;
    }
    if (numOccurr.includes(4)) {
        rank = 5;
    }
    if (numOccurr.includes(5)) {
        rank = 6;
    }

    let score = rank * Math.pow(10, hand.length * 2);
    for (let i = 0; i < hand.length; i++) {
        score += scoreCard(hand[i]) * Math.pow(10, (hand.length - (i + 1)) * 2);
    }

    return score;
}

function scoreCard(card: string): number {
    return ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"].indexOf(card);
}
