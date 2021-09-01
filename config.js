const path = require('path');

if(process.env.node_server) {
  console.log('=======================================================');
  console.log(`   current environment: telegraUserServer / ${JSON.stringify(process.env.node_server)}`);
  console.log('=======================================================');
}

const telegramConfig = {
  id: Number(process.env.telegramId),
  hash: process.env.telegramHash
}

const filePath = {
  userMember: path.resolve(__dirname + "/userMember.json")
}


module.exports = {
  telegramConfig,
  filePath
}