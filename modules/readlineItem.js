const readline = require("readline");

class ReadlineClass {
  constructor() {}
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  inputText() {
    
  }

}

const readlineItem = ReadlineClass.getInstance();

module.exports = readlineItem;