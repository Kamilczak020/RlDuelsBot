'use strict';
import 'babel-polyfill';
import * as dotenv from 'dotenv';
import express from 'express';
import { isNil } from 'lodash';
import { Bot } from './core/bot';
import { loadConfig } from './core/config';
import { createDatabase } from './core/database';
import { createLogger } from './core/logger';

import { livenessHealthcheck } from './healthcheck/liveness';
import { readinessHealthcheck } from './healthcheck/readiness';

import { EchoParser } from './parser/echoParser';
import { SplitParser } from './parser/splitParser';
import { EchoHandler } from './handler/echoHandler';
import { UrbanHandler } from './handler/urbanHandler';
import { UserActionHandler } from '../build/handler/userActionHandler';

dotenv.config();

const app = express();
const logger = createLogger();
const config = loadConfig('./build/config.yml');
const database = createDatabase();
const bot = new Bot(logger);

database.sequelize.authenticate().then((errors) => {
  if (!isNil(errors)) {
    logger.error({ errors }, 'Failed to connect to database');
    process.exit();
  }
});

// Healthchecks
app.get('/health/liveness', livenessHealthcheck);
app.get('/health/readiness', (req, res, next) => readinessHealthcheck(database, res));

// register parsers
bot.registerService(EchoParser, 'parser', config.parsers.echoParser);
bot.registerService(SplitParser, 'parser', config.parsers.splitParser);

// register handlers
bot.registerService(EchoHandler, 'handler', config.handlers.echoHandler);
bot.registerService(UserActionHandler, 'handler', config.handlers.userActionHandler);
bot.registerService(UrbanHandler, 'handler', config.handlers.urbanHandler);

if (process.argv[2] === 'sync') {
  try {
    database.sequelize.sync(); 
  } catch (err) {
    logger.error(err);
  }
}

process.on('exit', () => {
  bot.stop();
});

bot.start();
app.listen(8080);
