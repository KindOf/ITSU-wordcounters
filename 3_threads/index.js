import fs from 'node:fs';
import os from "node:os";

import { WPool } from "./pool.js"
import { EVENTS } from "./constants.js";

const script = "worker.js";
const filepath = '../source.txt';

(async () => {
    console.time();
    let linesProcessed = 0;
    const wp = new WPool(os.availableParallelism(), script)
    const words = {};


    const text = fs.readFileSync(filepath, 'utf8');

    const lines = text.split('\n');

    wp.on(EVENTS.WORD, word => {
        if (words[word]) {
            words[word] += 1;
        } else {
            words[word] = 1;
        }
    });

    wp.on(EVENTS.LINE, () => {
        linesProcessed++;
        if (linesProcessed === lines.length) {
            const sorted = Object.entries(words).sort((a, b) => {
                if (a[1] === b[1]) return 0;

                return a[1] < b[1] ? 1 : -1;
            })
            .slice(0, 100)
            console.log({ sorted })

            console.timeEnd();
            wp.close()
            clearInterval(interval);
            process.exit(0)
        } else {
            console.log(`[MAIN]: lines processed - ${linesProcessed} out of ${lines.length}`)
        }
    });

    lines.forEach(line => {
        wp.addTask(line);
    });

    console.log('Processing...')

    const interval = setInterval(() => console.log("working..."))
})()
