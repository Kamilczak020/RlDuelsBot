'use strict';
import { BaseHandler } from './baseHandler';
import { CommandData } from '../../build/model/commandData';
import { Message } from '../model/message';
import { isNil } from 'lodash';

export class BanHandler extends BaseHandler {
  async handle(cmd) {
    const data = await CommandData.findOne({ where: { CommandId: cmd.dataValues.id } });
    const message = await Message.findOne({ where: { id: cmd.dataValues.MessageId }});
    const channel = message.dataValues.channel;

    const regex = /<@(\d*)>/g;
    const matched = await regex.exec(data.dataValues.value);
    if (isNil(matched)) {
      return await this.replyToChannel(channel, 'User was not found.');
    }

    const user = await this.client.users.find((user) => user.id === matched[1]);
    if (isNil(user)) {
      return await this.replyToChannel(channel, 'User was not found.');
    }

    if (!user.bannable) {
      return await this.replyToChannel(channel, 'User cannot be banned.');
    }

    await user.ban();
    return await this.replyToChannel(channel, 'User banned successfully.')
  }
}
