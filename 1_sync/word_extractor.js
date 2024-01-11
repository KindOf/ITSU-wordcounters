import EventEmitter from 'node:events';

export const events = {
    WORD: 'word',
    END: 'end',
};

export class WordExtractor extends EventEmitter {
    constructor(text) {
        super();
        this.text = text;
    }

    count() {
        let word = "";
        let index = 0;

        while (index <= this.text.length) {
            if (this.isCharLetter(this.text[index])) {
                word += this.text[index];

                if (!this.isCharLetter(this.text[index + 1]) && word != "") {
                    this.emit(events.WORD, word.toLowerCase())
                    word = "";
                }
            }

            index++;
        }

        this.emit(events.END)
    }
    
    isCharLetter(char) {
        return /^[a-z]$/i.test(char);
    }
}

