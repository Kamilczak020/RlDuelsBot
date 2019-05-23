'use strict';
import { includes } from 'lodash';
import { mustExist } from '../util';

export class BaseParser {
  constructor(logger, options) {
    this.logger = logger;
    this.options = options;
  }

  async check(msg) {
    const cmd = mustExist(msg.dataValues.body.split(' ')[0]);
    this.logger.info('command parsed:', cmd);
    return includes(this.options.commands, cmd);
  }
}
