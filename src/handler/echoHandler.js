'use strict';
import { BaseHandler } from './baseHandler';
import { CommandData } from '../../build/model/commandData';
import { Message } from '../model/message';

export class EchoHandler extends BaseHandler {
  async handle(cmd) {
    const msgBody = await this.getData(cmd, 'body');
    const message = await Message.findOne({ where: { id: cmd.dataValues.MessageId }});
    const channel = message.dataValues.channel;

    return await this.replyToChannel(channel, msgBody);
  }
}
