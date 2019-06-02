'use strict';
import { BaseService } from '../core/baseService';
import { CommandData } from '../model/commandData';
import { includes } from 'lodash';

export class BaseHandler extends BaseService {
  /**
   * Checks if the command can be handled by the parser
   * @param {*} cmd command to check
   */
  async check(cmd) {
    return includes(this.options.commands, cmd.dataValues.name);
  }

  /**
   * Sends a reply to a given discord channel
   * @param {*} channel channel to reply to
   * @param {*} message message to reply with
   */
  /* istanbul ignore next */
  async replyToChannel(channel, message) {
    await this.client.channels.get(channel).send(message);
  }

  /**
   * Gets command data by key 
   * @param {*} cmd command to find data for
   * @param {*} key command data key
   */
  /* istanbul ignore next */
  async getData(cmd, key) {
    const data = await CommandData.findOne({ where: { CommandId: cmd.dataValues.id, key } });
    return data.dataValues.value;
  }
}
