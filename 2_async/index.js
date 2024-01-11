import fs from "fs";
import { WordExtractor, events } from "./word_extractor.js";

const filepath = '../source.txt';

function count(text) {
    const dict = {};
    const we = new WordExtractor(text);

    we.on(events.WORD, (word) => {
        dict[word] = dict[word] ? dict[word] + 1 : 1;
    })

    return new Promise((resolve) => {
        we.on(events.END, () => {
            resolve(dict);
        })

        we.count_async();
    })
}

function sortEntries(a, b) {
    if (a[1] === b[1]) return 0;

    return a[1] < b[1] ? 1 : -1;
}

function getTop(dict) {
    return Object.entries(dict).sort(sortEntries).slice(0, 100);
}

(async () => {
    try {
        const interval = setInterval(() => console.log("working..."), 5)
        const text = fs.readFileSync(filepath, 'utf8');

        console.time();
        const dict = await count(text);
        const top = getTop(dict);
        console.timeEnd();
        clearInterval(interval)
        console.log(top);

    } catch (e) {
        console.error(e)
        process.exit(1)
    }
})();
