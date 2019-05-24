'use strict';

export class BaseService {
  constructor(client, logger, options) {
    this.client = client;
    this.logger = logger;
    this.options = options;
  }

  /**
   * Sends a reply to a given discord channel
   * @param {*} channel channel to reply to
   * @param {*} message message to reply with
   */
  async replyToChannel(channel, message) {
    await this.client.channels.get(channel).send(message);
  }
}