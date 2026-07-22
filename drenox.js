const chalk = require('chalk');
const handleMessage = require('./handler'); // KnightBot er puran handler
const { loadCommands } = require('./utils/commandLoader');

const commands = loadCommands();

async function setupEventListeners(sock) {
  console.log(chalk.greenBright(`[DRENOX] ✅ Bridge Active`));
  // kichu kora lagbe na. pair.js nijei messages.upsert e call korbe
}

module.exports = { setupEventListeners };
