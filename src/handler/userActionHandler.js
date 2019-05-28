'use strict';
import { BaseHandler } from './baseHandler';
import { Message } from '../model/message';
import { isNil } from 'lodash';

export class UserActionHandler extends BaseHandler {
  async handle(cmd) {
    const command = cmd.dataValues.name;
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

    switch (command) {
      case 'kick': {
        if (!user.kickable) {
          return await this.replyToChannel(channel, 'User cannot be kicked.');
        }
        await user.kick();
        return await this.replyToChannel(channel, 'User kicked successfully.')
      }

      case 'ban': {
        if (!user.bannable) {
          return await this.replyToChannel(channel, 'User cannot be banned.');
        }
        await user.ban();
        return await this.replyToChannel(channel, 'User banned successfully.')
      }
    }
  }
}
