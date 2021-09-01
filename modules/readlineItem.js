const readline = require("readline");

/**
 * @description readlint 實體
 *
 * @class ReadlineClass
 */
class ReadlineClass {
  constructor() {}
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}

const readlineItem = ReadlineClass.getInstance();

module.exports = readlineItem;
