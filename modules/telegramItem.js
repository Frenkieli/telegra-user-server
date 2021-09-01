const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { Logger } = require("telegram/extensions");

const input = require("input");

const { telegramConfig } = require("../config");

Logger.setLevel("none"); // no logging

let a = null;
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

  init() {
    this.client = new TelegramClient(
      new StringSession(""),
      telegramConfig.id,
      telegramConfig.hash,
      { connectionRetries: 5 }
    );
  }

  async login(number) {
    await this.client.start({
      phoneNumber: number,
      password: async () => await input.text("請輸入密碼?"),
      phoneCode: async () => await input.text("請輸入驗證碼?"),
      onError: (err) => console.log("錯誤訊息 : " + err.errorMessage),
    });

    // console.log(); // Save this string to avoid logging in again

    console.log("登入成功");
    this.client.session.save();
    await this.client.sendMessage("me", { message: "node sevret is online!" });

    return true;
  }

}

const telegramItem = TelegramClass.getInstance();

telegramItem.init();

module.exports = telegramItem;
