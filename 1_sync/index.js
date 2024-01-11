import fs from 'node:fs'

const filepath = '../source.txt';

(async () => {
    try {
        const interval = setInterval(() => console.log("working..."))
        const text = fs.readFileSync(filepath, 'utf8');

        console.time();
        const top = Object.entries(text.split(/[^A-Z]/ig)
            .reduce((dict, word) => {
                if (word == '') return dict
                const w = word.toLowerCase()

                dict[w] = dict[w] ? dict[w] + 1 : 1;
                return dict;
            }, {}))
            .sort((a, b) => {
                if (a[1] === b[1]) return 0;

                return a[1] < b[1] ? 1 : -1;
            })
            .slice(0, 100)

        console.timeEnd();

        console.log(top)
        clearInterval(interval)
    } catch (e) {
        console.error(e)
        process.end(1)
    }
})();
