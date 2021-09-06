const interfaceItem = require("../view/interfaceItem");
const dataCenter = require("../dataCenter");
const telegramItem = require("../modules/telegramItem");

/**
 * @description 流程控制的實體
 *
 * @class FlowController
 */
class FlowController {
  constructor() {}
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * @description 進來的第一步
   *
   * @memberof FlowController
   */
  start() {
    interfaceItem.clearView();
    interfaceItem.welcome();
    this.home();
  }

  /**
   * @description 主選單
   *
   * @memberof FlowController
   */
  async home() {
    let selectOption = await interfaceItem.homeSelect();

    switch (selectOption) {
      case "登入":
        this.loginTelegram();
        break;

      case "註冊新成員":
        this.registerNewMember();
        break;

      case "刪除成員":
        this.deleteMember();
        break;

      case "顯示聊天頻道":
        this.updateChatList();
        break;

      case "離開":
        this.leaveApp();
        break;

      default:
        break;
    }
  }

  /**
   * @description 登入 telegram
   *
   * @memberof FlowController
   */
  async loginTelegram() {
    let member = await interfaceItem.selectUser();
    if (member) {
      let memberData =
        dataCenter.getData("userMember")[member.split(".")[0] - 1];
      if (await telegramItem.login(memberData.number)) {
        console.log("記錄人員");
        dataCenter.setData("user", memberData);
      }
      this.home();
    } else {
      this.home();
    }
  }

  /**
   * @description 刪除會員
   *
   * @memberof FlowController
   */
  async deleteMember() {
    let result = await interfaceItem.deleteMember();
    let data = dataCenter.getData("userMember");

    if (result) {
      for (let i = result.length - 1; i >= 0; i--) {
        data.splice(Number(result[i].split(".")[0]) - 1, 1);
        dataCenter.setData("userMember", data);
      }
    } else {
      this.home();
    }
  }

  /**
   * @description 註冊新成員
   *
   * @memberof FlowController
   */
  async registerNewMember() {
    let result = await interfaceItem.registerNewMember();
    let data = dataCenter.getData("userMember");
    console.log(data);
    data.push(result);
    dataCenter.setData("userMember", data);
    this.home();
  }

  /**
   * @description 關閉 app
   *
   * @memberof FlowController
   */
  async leaveApp() {
    interfaceItem.clearView();
    console.log("按 任意鍵 離開程式");
    await interfaceItem.pressToContinue();
    process.stdin.on("data", process.exit());
  }

  /**
   * @description 獲取資料的同時更新頻道列表
   *
   * @memberof FlowController
   */
  async updateChatList() {
    let chatList = await telegramItem.getChatList();
    dataCenter.setData("chatList", chatList.chats);
    interfaceItem.showChatList();
    this.home();
  }
}

const flowController = FlowController.getInstance();

module.exports = flowController;
