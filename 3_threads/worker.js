import { parentPort } from 'node:worker_threads';

function isLetter(char) {
    return /^[a-z]$/i.test(char)
}

parentPort.on('message', (line) => {
    //console.log(`[WORKER]: line recieved - ${line}`);
    let word = "";
    let index = 0;

    while (index <= line.length) {
        if (isLetter(line[index])) {
            word += line[index];

            if (!isLetter(line[index + 1]) && word != "") {
                parentPort.postMessage({ type: "word", word });
                word = "";
            }
        }

        index++;
    }

    parentPort.postMessage({ type: "end" })
});
