'use strict';
import { Sequelize } from 'sequelize';
import { Message } from '../model/message'; 
import { Command } from '../model/command';
import { CommandData } from '../model/commandData';

export function createDatabase(options) {
  const sequelize = new Sequelize({
    database: options.database,
    dialect: options.dialect,
    host: options.host,
    password: options.password,
    username: options.username
  });

  // Link models to database here
  const models = {
    Message: Message.init(sequelize, Sequelize),
    Command: Command.init(sequelize, Sequelize),
    CommandData: CommandData.init(sequelize, Sequelize)
  };
  
  Object.values(models)
    .filter((model) => typeof model.associate === 'function')
    .forEach((model) => model.associate(models));
  
  return {
    ...models,
    sequelize
  };
}
