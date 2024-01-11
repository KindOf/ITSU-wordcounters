import fs from "fs";

const filepath = '../source.txt';

function isCharLetter(char) {
  return /^[a-z]$/i.test(char);
}

function count(text) {
    const res = {};
    let curr = "";
    let index = 0;

    while (index <= text.length) {
        if (isCharLetter(text[index])) {
            curr += text[index];

            if (!isCharLetter(text[index+1]) && curr != "") {
                if (res[curr.toLowerCase()]) {
                    res[curr.toLowerCase()] += 1;
                } else {
                    res[curr.toLowerCase()] = 1;
                }

                curr = "";
            }
        }

        index++;
    }

    return res;
}

function sortEntries(a,b) {
    if (a[1] === b[1]) return 0;

    return a[1] < b[1] ? 1 : -1;
}

function getTop(dict) {
    return Object.entries(dict).sort(sortEntries).slice(0, 100);
}

(() => {
    const text = fs.readFileSync(filepath, 'utf8');
    console.time();
    const top = getTop(count(text));
    console.timeEnd();

    console.log(top);
})();
