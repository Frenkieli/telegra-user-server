const input = require("input");

const dataCenter = require("../dataCenter");

class InterfaceClass {
  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  welcome() {
    console.log("=======================================================");
    console.log("=======================================================");
    console.log("============                               ============");
    console.log("============     Welcome Node Telegram     ============");
    console.log("============                               ============");
    console.log("=======================================================");
    console.log("=======================================================");
  }

  async homeSelect() {
    let name = dataCenter.getData("user").name || "遊客";
    let option = ["註冊新成員", "登入", "離開"];
    if (name !== "遊客") {
      option.splice(0, 1, ...["註冊新成員"]);
    }
    let selectOption = await input.select(name + " 你好：", option);

    return selectOption;
  }

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
      console.log("=> 電話: %s"　+ number, "\x1b[36m", "\x1b[0m");

      confirm = await input.confirm("確定嗎?", {
        default: true,
      });
    }

    return {
      name,
      number
    }
  }

  clearView() {
    process.stdout.write(
      process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
    );
  }
}

const interfaceItem = InterfaceClass.getInstance();

module.exports = interfaceItem;
