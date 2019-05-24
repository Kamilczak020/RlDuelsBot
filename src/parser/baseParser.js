'use strict';
import { includes } from 'lodash';
import { mustExist } from '../util';
import { BaseService } from '../core/baseService';

export class BaseParser extends BaseService {
  async check(msg) {
    const cmd = mustExist(msg.dataValues.body.split(' ')[0]);
    this.logger.debug('command parsed:', cmd);
    return includes(this.options.commands, cmd);
  }
}
