const interfaceItem = require("../view/interfaceItem");
const dataCenter = require("../dataCenter");
const telegramItem = require("../modules/telegramItem");

class FlowController {
  constructor() {}
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  start() {
    interfaceItem.clearView();
    interfaceItem.welcome();
    this.home();
  }

  async home() {
    let selectOption = await interfaceItem.homeSelect();

    switch (selectOption) {
      case "登入":
          this.loginTelegram();
        break;

      case "註冊新成員":
          this.registerNewMember();
        break;
        

      case "離開":
          this.leaveApp();
        break;

      default:
        break;
    }
  }

  async loginTelegram() {
    let member = await interfaceItem.selectUser();
    if(member) {
      let memberData = dataCenter.getData("userMember")[member.split(".")[0] - 1];
      if(await telegramItem.login(memberData.number)) {
        console.log("記錄人員");
        dataCenter.setData("user", memberData);
      }
      this.home();
    }else {
      this.home();
    }
  }

  async registerNewMember() {
    let result = await interfaceItem.registerNewMember();
    var data = dataCenter.getData("userMember");
    console.log(data);
    data.push(result);
    dataCenter.setData("userMember", data);
    this.home();
  }

  leaveApp() {
    interfaceItem.clearView();

    console.log("按 任意鍵 離開程式");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", process.exit.bind(process, 0));
  }
}

const flowController = FlowController.getInstance();

module.exports = flowController;
