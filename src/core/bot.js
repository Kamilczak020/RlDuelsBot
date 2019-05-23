'use strict';
import { Client } from 'discord.js';
import { Subject } from 'rxjs';
import { Message } from '../model/message';
import { isNil } from 'lodash';

export class Bot {
  constructor(config, logger, database) {
    this.config = config;
    this.logger = logger;
    this.logger.info('Creating bot.');

    this.database = database;

    this.commands = new Subject();
    this.incoming = new Subject();
    this.outgoing = new Subject();

    this.parsers = [];
    this.handlers = [];

    this.client = new Client();
  }

  /**
   * Starts the bot service, attaches event handlers.
   */
  async start() {
    this.logger.info('Starting bot.');

    const streamError = (err) => {
      this.logger.error(err, 'bot stream did not handle error');
    };

    this.commands.subscribe((next) => this.handleCommand(next).catch(streamError));
    this.incoming.subscribe((next) => this.handleIncoming(next).catch(streamError));
    this.outgoing.subscribe((next) => this.handleOutgoing(next).catch(streamError));

    this.client.on('ready', () => this.logger.debug('Discord listener is ready'));
    this.client.on('message', (input) => this.convertMessage(input).then((msg) => this.incoming.next(msg)));

    this.client.login(this.config.bot.token);
  }

  /**
   * Stops the bot, completes the observables, removes event listeners.
   */
  async stop() {
    this.commands.complete();
    this.incoming.complete();
    this.outgoing.complete();

    this.client.removeAllListeners('ready');
    this.client.removeAllListeners('message');
    await this.client.destroy();
  }

  async handleIncoming(msg) {
    this.parsers.forEach(async (parser) => {
      if (await parser.check(msg)) {
        try {
          await msg.save();
          const command = await parser.parse(msg);
          this.commands.next(command);
          return;
        } catch (err) {
          this.logger.error('Parser failed to parse the message');
        }
      }
    });

    this.logger.debug({ msg }, 'Message did not produce any commands');
  }

  async handleCommand(cmd) {
    this.handlers.forEach(async (handler) => {
      if (await handler.check(cmd)) {
        try {
          const response = await handler.handle(cmd);
          console.log(response);
          if (!isNil(response)) {
            this.outgoing.next(response);
          }
          return;
        } catch (err) {
          this.logger.error('Handler failed to handle the message');
        }
      }
    });

    this.logger.debug({ cmd }, 'Command was not handled');
  }

  async handleOutgoing(data) {
    this.client.channels.get(data.channel).send(data.body);
  }

  /**
   * Converts the discord message to a message entity.
   * @param {*} msg message to convert
   */
  async convertMessage(msg) {
    this.logger.debug({ msg }, 'Converting discord message');

    return await new Message({
      author: msg.author.id,
      body: msg.content,
      channel: msg.channel.id,
      createdAt: msg.createdAt,
      id: msg.id,
      reactions: msg.reactions.map((r) => r.emoji.name)
    });
  }

  registerParser(parser) {
    this.parsers.push(parser);
    this.logger.info({ name: parser.name }, 'Registered parser');
  }

  registerHandler(handler) {
    this.handlers.push(handler);
    this.logger.info({ name: handler.name }, 'Registered parser');
  }
}
