'use strict';
import { BaseHandler } from './baseHandler';
import { CommandData } from '../../build/model/commandData';
import { Message } from '../model/message';
import { isNil } from 'lodash';

export class KickHandler extends BaseHandler {
  async handle(cmd) {
    const body = await this.getData(cmd, 'body');
    const message = await Message.findOne({ where: { id: cmd.dataValues.MessageId }});
    const channel = message.dataValues.channel;

    const regex = /<@(\d*)>/g;
    const matched = await regex.exec(body);
    if (isNil(matched)) {
      return await this.replyToChannel(channel, 'User was not found.');
    }

    const user = await this.client.users.find((user) => user.id === matched[1]);
    if (isNil(user)) {
      return await this.replyToChannel(channel, 'User was not found.');
    }

    if (!user.kickable) {
      return await this.replyToChannel(channel, 'User cannot be kicked.');
    }

    await user.kick();
    return await this.replyToChannel(channel, 'User kicked successfully.')
  }
}
