const input = require("input");

const dataCenter = require("../dataCenter");

/**
 * @description 主要畫面
 *
 * @class InterfaceClass
 */
class InterfaceClass {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * @description welcome
   *
   * @memberof InterfaceClass
   */
  welcome() {
    console.log("=======================================================");
    console.log("=======================================================");
    console.log("============                               ============");
    console.log("============     Welcome Node Telegram     ============");
    console.log("============                               ============");
    console.log("=======================================================");
    console.log("=======================================================");
  }

  /**
   * @description 主選單
   *
   * @return {string} pick option
   * @memberof InterfaceClass
   */
  async homeSelect() {
    let name = dataCenter.getData("user").name || "遊客";
    let option = ["刪除成員", "登入", "註冊新成員", "離開"];
    if (name !== "遊客") {
      option.splice(0, 1, ...["刪除成員"]);
    }
    let selectOption = await input.select(name + " 你好：", option);

    return selectOption;
  }

  /**
   * @description pick user
   *
   * @return {*} user info pf false
   * @memberof InterfaceClass
   */
  async selectUser() {
    let userMember = dataCenter.getData("userMember");
    let selectOption = false;
    if (userMember.length > 1) {
      selectOption = await input.select("請選擇要登入的成員", [
        ...userMember.map((data, index) => {
          return index + 1 + "." + data.name + " (" + data.number + ")";
        }),
        "取消",
      ]);
      if (selectOption === "取消") selectOption = false;
    } else if (userMember.length === 1) {
      let a = await input.confirm(
        "登入成員 " + userMember[0].name + " (" + userMember[0].number + ") ?",
        {
          default: true,
        }
      );
      if (a)
        selectOption =
          "1." + userMember[0].name + " (" + userMember[0].number + ")";
    } else {
      console.log("沒有註冊的登陸成員，請先新增用戶");
    }

    return selectOption;
  }

  /**
   * @description delete member
   *
   * @return {*} array or false
   * @memberof InterfaceClass
   */
  async deleteMember() {
    let vm = this;
    let userMember = dataCenter.getData("userMember");
    let selectOption = false;
    if (userMember.length >= 1) {
      selectOption = await input.checkboxes(
        "請選擇要刪除的成員",
        [
          ...userMember.map((data, index) => {
            return index + 1 + "." + data.name + " (" + data.number + ")";
          }),
          "取消",
        ],
        {
          validate(answer) {
            if (answer.length >= 1) return true;

            return "至少要選擇一個選項";
          },
        }
      );
      if (selectOption[selectOption.length - 1] === "取消") {
        console.log("正在跳回主頁，按下 任意建 繼續");
        await vm.pressToContinue();
        selectOption = false;
      }
    } else {
      console.log("目前沒有成員，按下 任意建 繼續");
      await vm.pressToContinue();
    }
    return selectOption;
  }

  /**
   * @description register member 
   *
   * @return {*} object of user info
   * @memberof InterfaceClass
   */
  async registerNewMember() {
    let name = null;
    let nameConfirm = false;
    let number = null;
    let numberConfirm = false;
    let confirm = false;
    while (!confirm) {
      while (!nameConfirm) {
        name = await input.text("請輸入名稱", {
          default: "用戶",
          validate(answer) {
            if (answer !== "遊客" || answer) return true;

            return "名稱不能是遊客或是空的";
          },
        });

        nameConfirm = await input.confirm(name + " 確定嗎?", {
          default: true,
        });
      }

      while (!numberConfirm) {
        number = await input.text("請輸入電話", {
          default: "+886123456789",
          validate(answer) {
            let reg = /^[+]+[0-9]/;
            if (reg.test(answer)) return true;

            return "只能為國碼 + 數字";
          },
        });

        numberConfirm = await input.confirm(number + " 確定嗎?", {
          default: true,
        });
      }

      console.log("=> 名稱: %s" + name, "\x1b[36m", "\x1b[0m");
      console.log("=> 電話: %s" + number, "\x1b[36m", "\x1b[0m");

      confirm = await input.confirm("確定嗎?", {
        default: true,
      });
    }

    return {
      name,
      number,
    };
  }

  clearView() {
    process.stdout.write(
      process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
    );
  }

  async pressToContinue() {
    return new Promise((resolve) => {
      const handler = () => {
        process.stdin.removeListener("data", handler);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve();
      };

      process.stdin.resume();
      process.stdin.setRawMode(true);
      process.stdin.once("data", handler);
    });
  }
}

const interfaceItem = InterfaceClass.getInstance();

module.exports = interfaceItem;
