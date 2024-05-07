import { performance } from 'node:perf_hooks';
import { v4 as uuid } from 'uuid';

export default class StopWatch {
  #init = 0;
  #final = 0;

  #lapNum = 0;

  #id;

  constructor() {
    this.#id = uuid();
  }

  start() {
    this.#init = performance.now();
    performance.mark(`${this.#id}-init`);
  }

  stop() {
    this.#final = performance.now();
    performance.mark(`${this.#id}-end`);
  }

  lap() {
    this.#lapNum++;
    performance.mark(`${this.#id}-lap-${this.#lapNum}`);
  }

  reset() {
    performance.clearMarks(`${this.#id}-init`);
    performance.clearMarks(`${this.#id}-end`);

    if (this.#lapNum > 0) {
      while (this.#lapNum > 0) {
        performance.clearMarks(`${this.#id}-lap-${this.#lapNum}`);
        this.#lapNum--;
      }
    }

    this.#init = 0;
    this.#final = 0;

    this.#lapNum = 1;
  }

  get laps() {
    return performance.getEntries().filter(({ name }) => name.includes(this.#id));
  }

  elapsed(format: 'ms' | 's') {
    return format === 'ms'
      ? this.#final - this.#init + format
      : parseFloat(((this.#final - this.#init) / 1000).toFixed(4)) + format;
  }
}
