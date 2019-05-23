'use strict';

export class BaseHandler {
  constructor(logger, options) {
    this.logger = logger;
    this.options = options;
  }

  async check(cmd) {
    return this.options.command === cmd.dataValues.name;
  }
}