const path = require('path');
const interfaceItem = require("../view/interfaceItem");
const dataCenter = require("../dataCenter");
const telegramItem = require("../modules/telegramItem");
const fsItem = require("../modules/fsItem");
const { filePath } = require("../config");
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

      case "關閉重複發話":
        this.endRepeatProcess();
        break;

      case "顯示頻道":
        this.updateChatList();
        break;

      case "發送訊息":
        this.sendMessage();
        break;

      case "監視器模式":
        this.logMode();
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
        dataCenter.setData("user", memberData);
        let chatList = await telegramItem.getChatList();
        dataCenter.setData("chatList", chatList.chats);
      }
    }
    this.home();
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
      console.log("");
    }
      this.home();
  }

  /**
   * @description 註冊新成員
   *
   * @memberof FlowController
   */
  async registerNewMember() {
    let result = await interfaceItem.registerNewMember();
    let data = dataCenter.getData("userMember");
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
   * @description select chart list and send message
   *
   * @memberof FlowController
   */
  async sendMessage() {
    let selectChatOption = await interfaceItem.selectChatList();
    
    if(!selectChatOption) {
      this.home();
      return;
    }

    let selectMessage = await interfaceItem.selectMessageList();
    
    if(!selectMessage) {x
      this.home();
      return;
    }

    let message = await fsItem.readFile(path.resolve(filePath.messageFolder + "/" + selectMessage.split(".")[1] + ".txt"));
    
    let confirm = await interfaceItem.confirmChatListAndMessage(selectChatOption, message);

    if(confirm) {

      let repeatConfirm = await interfaceItem.repeatConfirm();

      if(repeatConfirm) {
        let repeatProcess = dataCenter.getData("repeatProcess");
        repeatProcess.push({
          chatList: selectChatOption,
          fileName: selectMessage.split(".")[1] + ".txt",
          time: repeatConfirm,
          timeoutInstance: setInterval(() => {
            for(let i = 0 ; i < selectChatOption.length ; i++) {
              setTimeout(() => {
                let chatStr = selectChatOption[i].split("#chatId=");
                telegramItem.sendMessage(chatStr[1], message);
                chatStr[0] = chatStr[0].split(".");
                chatStr[0].splice("0", 1);
                interfaceItem.onLogModeMessage("檔案" + selectMessage.split(".")[1] + ".txt" + "發送至 " + chatStr[0].join(""));
              }, i * 1000);
            }
          }, repeatConfirm * 60 * 1000)
        })

        interfaceItem.showRepeatProcess();

      }else{
        for(let i = 0 ; i < selectChatOption.length ; i++) {
          setTimeout(() => {
            telegramItem.sendMessage(selectChatOption[i].split("#chatId=")[1], message);
          }, i * 1000);
        }
      }
    }

    this.home();
  }

  /**
   * @description end repeat process
   *
   * @memberof FlowController
   */
  async endRepeatProcess() {

    await interfaceItem.showRepeatProcess();
    let selectProcess = await interfaceItem.selectRepeatProcess();

    if(selectProcess) {
      let repeatProcess = dataCenter.getData("repeatProcess");
      for(let i = selectProcess.length - 1 ; i >= 0 ; i--) {
        console.log(selectProcess[i].split('.')[0]);
        clearInterval(repeatProcess[i].timeoutInstance);
        repeatProcess.splice(Number(result[i].split(".")[0]) - 1, 1);
      }
    }

    this.home(); 
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

  /**
   * @description in log mode 
   *
   * @memberof FlowController
   */
  async logMode() {
    await interfaceItem.logMode();

    this.home();
  }
}

const flowController = FlowController.getInstance();

module.exports = flowController;
