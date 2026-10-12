function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = randomInt(i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// Random order without repeats until every item has been used once.
class ShuffleBag {
    constructor(items) {
        this.items = items;
        this.remaining = [];
    }

    next() {
        if (this.remaining.length === 0) {
            this.remaining = shuffle(this.items);
        }
        return this.remaining.pop();
    }
}

module.exports = { randomInt, shuffle, ShuffleBag };
