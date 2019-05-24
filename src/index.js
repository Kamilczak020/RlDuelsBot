'use strict';
import 'babel-polyfill';
import { isNil } from 'lodash';
import { Bot } from './core/bot';
import { loadConfig } from './core/config';
import { createDatabase } from './core/database';
import { createLogger } from './core/logger';

import { EchoParser } from './parser/echoParser';
import { SplitParser } from './parser/splitParser';
import { EchoHandler } from './handler/echoHandler';
import { KickHandler } from './handler/kickHandler';
import { BanHandler } from './handler/banHandler';

const logger = createLogger();
const config = loadConfig('./build/config.yml');
const database = createDatabase(config.database);
const bot = new Bot(config, logger, database);

database.sequelize.authenticate().then((errors) => {
  if (!isNil(errors)) {
    logger.error({ errors }, 'Failed to connect to database');
    process.exit();
  }
})

// register parsers
bot.registerParser(EchoParser, config.parsers.echoParser);
bot.registerParser(SplitParser, config.parsers.splitParser);

// register handlers
bot.registerHandler(EchoHandler, config.handlers.echoHandler);
bot.registerHandler(KickHandler, config.handlers.kickHandler);
bot.registerHandler(BanHandler, config.handlers.banHandler);

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