import { EventEmitter } from "node:events";
import { Worker } from "node:worker_threads";

import { EVENTS } from "./constants.js";

export class WPool extends EventEmitter {
    workers = [];
    tasks = [];

    constructor(cpus, workerScript) {
        super();

        for (let i = 0; i < cpus; i++) {
            this.addWorker(workerScript);
        }

        this.on(EVENTS.FREE, () => {
            if (this.tasks.length !== 0) {
                const task = this.tasks.pop();
                const worker = this.workers.pop();

                worker.postMessage(task);
            }
        });
    }

    addWorker(script) {
        const worker = new Worker(new URL(script, import.meta.url));

        worker.on('message', (result) => {
            if (result.type === "word") {
                this.emit(EVENTS.WORD, result.word);
            }

            if (result.type === "end") {
                this.workers.push(worker);
                this.emit(EVENTS.FREE);
                this.emit(EVENTS.LINE);
            }
        });

        this.workers.push(worker);
    }

    addTask(task) {
        if (this.workers.length === 0) {
            this.tasks.push(task)
            return;
        }

        const worker = this.workers.pop();

        worker.postMessage(task);
    }

    close() {
        for (const worker of this.workers) worker.terminate();
    }
}

