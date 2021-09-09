const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Logger } = require("telegram/extensions");

const input = require("input");

const { telegramConfig } = require("../config");

Logger.setLevel("none"); // no logging

/**
 * @description telegram 實體套件
 *
 * @class TelegramClass
 */
class TelegramClass {
  constructor() {
    this.client = null;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * @description 初始化 telegram 實體
   *
   * @memberof TelegramClass
   */
  init() {
    this.client = new TelegramClient(
      new StringSession(""),
      telegramConfig.id,
      telegramConfig.hash,
      { connectionRetries: 5 }
    );
  }

  /**
   * @description 登入 telegram
   *
   * @param {string} number +886123456789 telegram account number
   * @return {*}
   * @memberof TelegramClass
   */
  async login(number) {
    await this.client.start({
      phoneNumber: number,
      password: async () => await input.text("請輸入密碼?"),
      phoneCode: async () => await input.text("請輸入驗證碼?"),
      onError: (err) => console.log("錯誤訊息 : " + err.errorMessage),
    });

    // console.log(); // Save this string to avoid logging in again

    console.log("");
    console.log("\x1b[36m", "成功登入");
    console.log("");
    this.client.session.save();
    await this.client.sendMessage("me", { message: "node sevret is online! " + new Date().toLocaleString()});

    return true;
  }

  /**
   * @description get chat list
   *
   * @return {*} telegram chat data
   * @memberof TelegramClass
   */
  async getChatList() {
    const allChats = await this.client.invoke(
      new Api.messages.GetAllChats({
        exceptIds: [],
      })
    );

    return allChats;
  }

  /**
   * @description sendMessage
   *
   * @param {*} id chat id
   * @param {*} message read txt message
   * @return {*} 
   * @memberof TelegramClass
   */
  async sendMessage(id, message) {
    return await this.client.invoke(
      new Api.messages.SendMessage({
        peer: Number(id),
        message: message,
      })
    ).catch(err=>{
      switch (err.code) {
        case 420:
            console.log("發送過於頻繁，請等待:" + err.seconds + "s")
          break;
      
        default:
          console.log("未知錯誤，如持續發生請通知工程人員");
          console.log();
          console.log(err);
          break;
      }
    })
  }

}

const telegramItem = TelegramClass.getInstance();

telegramItem.init();

module.exports = telegramItem;
