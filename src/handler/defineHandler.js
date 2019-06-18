'use strict';
import * as axios from 'axios';
import { BaseHandler } from './baseHandler';
import { Message } from '../model/message';
import { isEmpty } from 'lodash';
import { RichEmbed } from 'discord.js';

export class DefineHandler extends BaseHandler {
  async handle(cmd) {
    const term = await this.getData(cmd, 'body');
    const message = await Message.findOne({ where: { id: cmd.dataValues.MessageId }});
    const channel = message.dataValues.channel;

    const fields = 'definitions,pronunciations,examples';
    const response = await axios.get(`https://od-api.oxforddictionaries.com/api/v2/entries/en-gb/${term}?fields=${fields}&strictMatch=false`, {
      headers: {
        'app_id': process.env.OXFORD_APP_ID,
        'app_key': process.env.OXFORD_API_KEY
      }
    });
  }
}