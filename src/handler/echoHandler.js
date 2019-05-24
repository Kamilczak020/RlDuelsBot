'use strict';
import { BaseHandler } from './baseHandler';
import { CommandData } from '../../build/model/commandData';
import { Message } from '../model/message';

export class EchoHandler extends BaseHandler {
  async handle(cmd) {
    const data = await CommandData.findOne({ where: { CommandId: cmd.dataValues.id } });
    const message = await Message.findOne({ where: { id: cmd.dataValues.MessageId }});

    return await this.replyToChannel(message.dataValues.channel, data.dataValues.value);
  }
}
