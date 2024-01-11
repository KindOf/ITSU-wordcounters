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

    count_async(word = "", index = 0) {
        if (index === this.text.length) {
            this.emit(events.END)
            return
        }

        if (this.isCharLetter(this.text[index])) {
            word += this.text[index];

            if (!this.isCharLetter(this.text[index + 1]) && word != "") {
                this.emit(events.WORD, word.toLowerCase())
                word = "";
            }
        }

        index++;
        setImmediate(() => this.count_async(word, index))
    }

    isCharLetter(char) {
        return /^[a-z]$/i.test(char);
    }
}

