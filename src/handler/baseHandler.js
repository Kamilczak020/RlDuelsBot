'use strict';
import { BaseService } from '../core/baseService';

export class BaseHandler extends BaseService {
  /**
   * Checks if the command can be handled by the parser
   * @param {*} cmd command to check
   */
  async check(cmd) {
    return this.options.command === cmd.dataValues.name;
  }
}