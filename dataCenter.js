const { readFile, saveJson } = require("./modules/fsItem");
const { filePath } = require("./config");

/**
 * @description 資料都存在這邊
 *
 * @class DataCenter
 */
class DataCenter {
  constructor() {
    this.state = {};
    this.state.user = {
      name: null,
    };
    this.state.userMember = [];
    this.state.chatList = [];
    // {
    //   chatList: [],
    //   fileName: "xxx",
    //   time: 1,
    //   timeoutInstance: NodeJS.Timeout 
    // }
    this.state.repeatProcess = [];
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * @description get state data
   *
   * @param {string} key user | userMember | chatList | repeatProcess
   * @return {any} state the data
   * @memberof DataCenter
   */
  getData(key) {
    return this.state[key];
  }

  /**
   * @description set state data and handle event
   *
   * @param {string} key user | userMember | chatList | repeatProcess
   * @param {any} data state the data
   * @memberof DataCenter
   */
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

readFile(filePath.userMember).then((data) => {
  dataCenter.setData("userMember", JSON.parse(data));
});

module.exports = dataCenter;
