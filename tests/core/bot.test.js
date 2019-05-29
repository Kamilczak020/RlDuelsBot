'use strict';
import * as sinon from 'sinon';
import * as bunyan from 'bunyan';
import { expect } from 'chai';
import { createLogger } from '../../src/core/logger';
import { Bot } from '../../src/core/bot';
import { Message as DiscordMessage } from 'discord.js';


const loggerInstance = sinon.stub();
loggerInstance.debug = sinon.stub();
const botInstance = new Bot(sinon.stub(), loggerInstance);

const discordMessage = sinon.createStubInstance(DiscordMessage);
discordMessage.author = { id: '1', username: 'Greenchill' };
discordMessage.content = 'message';
discordMessage.channel = { id: '1', type: 'text' };
discordMessage.id = '1';
discordMessage.reactions = [{ emoji: { name: ':lul:' }}];

describe('Bot Module', () => {
  it('Should be able to convert a discord message to a message entity', async () => {
    const convertedMessage = await botInstance.convertMessage(discordMessage);
    
    console.log(discordMessage);

    expect(convertedMessage).to.haveOwnProperty('author');
    expect(convertedMessage).to.haveOwnProperty('body');
    expect(convertedMessage).to.haveOwnProperty('channel');
    expect(convertedMessage).to.haveOwnProperty('id');
    expect(convertedMessage).to.haveOwnProperty('reactions');
  });
});
