'use strict';
import 'babel-polyfill';
import { Bot } from './core/bot';
import { loadConfig } from './core/config';
import { createDatabase } from './core/database';
import { createLogger } from './core/logger';

import { EchoParser } from './parser/echoParser';
import { SplitParser } from './parser/splitParser';
import { EchoHandler } from './handler/echoHandler';

const logger = createLogger();
const config = loadConfig('./build/config.yml');
const database = createDatabase(config.database);
const bot = new Bot(config, logger, database);

// register parsers
bot.registerParser(new EchoParser(logger, config.parsers.echoParser));
bot.registerParser(new SplitParser(logger, config.parsers.splitParser));

// register handlers
bot.registerHandler(new EchoHandler(logger, config.handlers.echoHandler));

if (process.argv[2] === 'sync') {
  try {
    database.sequelize.sync(); 
  } catch (err) {
    logger.error(err);
  }
}

bot.start();

process.on('exit', () => {
  bot.stop();
});