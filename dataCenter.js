const { readJson, saveJson } = require("./modules/fsItem");
const { filePath } = require("./config");

class DataCenter {
  constructor() {
    this.state = {};
    this.state.user= {
      name: null
    };
    this.state.userMember = [];


  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  getData(key) {
    return this.state[key];
  }

  setData(key, data) {
    this.state[key] = data;
    switch (key) {
      case "userMember":
        saveJson(filePath.userMember, data);
        break;
    
      default:
        break;
    }
  }

}

const dataCenter = DataCenter.getInstance();

readJson(filePath.userMember).then(data=>{
  dataCenter.setData("userMember", JSON.parse(data));
});

module.exports = dataCenter;