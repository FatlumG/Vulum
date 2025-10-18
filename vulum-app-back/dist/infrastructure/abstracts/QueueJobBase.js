"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueJobBase = void 0;
const bullmq_1 = require("bullmq");
class QueueJobBase {
    constructor(data) {
        this.jobName = this.constructor.name;
        this.data = data;
    }
    process() {
        this.queue = new bullmq_1.Queue(this.jobName);
        this.queueScheduler = new bullmq_1.QueueScheduler(this.jobName);
        this.queueEvents = new bullmq_1.QueueEvents(this.jobName);
        this.queue.add(this.jobName, this.data, this.jobOptions);
        const worker = new bullmq_1.Worker(this.jobName, this.handle);
        worker.on('completed', this.onCompleted);
        worker.on('failed', this.onFailed);
    }
    setOptions(jobOptions) {
        this.jobOptions = jobOptions;
        return this;
    }
    dispatch() {
        this.process();
    }
    onCompleted(job) {
        //
    }
    onFailed(job) {
        //
    }
}
exports.QueueJobBase = QueueJobBase;
//# sourceMappingURL=QueueJobBase.js.map